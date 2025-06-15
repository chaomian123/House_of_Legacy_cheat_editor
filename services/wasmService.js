// 从CDN加载WASM模块
const WASM_CDN_URL = 'https://makemaze.online/wasm/1750021714445_8u87qbny.wasm';
const WASM_CDN_JS_URL = 'https://makemaze.online/js/1750023870567_wstc5r0x.js';

// 本地路径作为备选
const LOCAL_WASM_JS_URL = '../pkg/uesave_wasm.js';

// 模拟未加载状态下的函数接口
let parse_sav_to_json = null;
let encode_json_to_sav = null;
let init = null;

// 全局状态
let wasmInitialized = false;
let initPromise = null;
let loadAttempts = 0;

/**
 * 检测浏览器环境和功能
 */
function detectEnvironment() {
  try {
    const env = {};
    
    // 检查浏览器信息
    if (typeof navigator !== 'undefined') {
      env.userAgent = navigator.userAgent || 'unknown';
      env.language = navigator.language || 'unknown';
    }
    
    // 检查WebAssembly支持
    env.webAssemblySupport = false;
    if (typeof WebAssembly !== 'undefined') {
      env.webAssemblySupport = true;
    }
    
    // 检查fetch支持
    env.fetchSupport = false;
    if (typeof fetch !== 'undefined') {
      env.fetchSupport = true;
    }
    
    // 检查cookie支持
    env.cookieSupport = false;
    if (typeof document !== 'undefined' && document.cookie) {
      env.cookieSupport = true;
      env.secureCookies = document.cookie.includes('secure');
    }
    
    // 尝试检测隐私模式
    env.isPrivateMode = false;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('__test', '1');
        localStorage.removeItem('__test');
      }
    } catch (e) {
      env.isPrivateMode = true;
    }
    
    console.log('Browser environment:', env);
    return env;
  } catch (e) {
    console.error('Error detecting environment:', e);
    return { error: e.message };
  }
}

/**
 * 初始化 WASM 模块
 * 使用单例模式确保只初始化一次
 */
export const initializeWasm = async () => {
  // 如果已经初始化，直接返回
  if (wasmInitialized) {
    return;
  }

  // 如果正在初始化，等待完成
  if (initPromise) {
    return initPromise;
  }

  // 开始初始化
  initPromise = (async () => {
    try {
      console.log("🚀 正在初始化 WASM 模块...");
      
      // 检测环境
      const env = detectEnvironment();
      
      // 最大尝试次数
      const maxAttempts = 3;
      loadAttempts++;
      
      if (loadAttempts > maxAttempts) {
        throw new Error(`已达到最大尝试次数(${maxAttempts})，请刷新页面重试`);
      }
      
      // 尝试不同的加载方法，直到成功为止
      const loadMethods = [
        loadFromCdnImport, 
        loadFromCdnFetch, 
        loadFromLocalImport,
        setupFallbackFunctions
      ];
      
      let lastError = null;
      
      // 尝试所有加载方法
      for (const loadMethod of loadMethods) {
        try {
          console.log(`尝试使用 ${loadMethod.name} 方法加载...`);
          await loadMethod();
          wasmInitialized = true;
          console.log(`✅ WASM 模块通过 ${loadMethod.name} 初始化成功`);
          return;
        } catch (error) {
          lastError = error;
          console.warn(`❌ ${loadMethod.name} 方法加载失败:`, error);
          // 继续尝试下一个方法
        }
      }
      
      // 如果所有方法都失败
      throw new Error(`所有加载方法都失败，最后一个错误: ${lastError}`);
    } catch (error) {
      console.error("❌ WASM 模块初始化失败:", error);
      wasmInitialized = false;
      initPromise = null;
      throw new Error(`WASM 初始化失败: ${error}`);
    }
  })();

  return initPromise;
};

// 方法1: 通过动态导入CDN JS模块
async function loadFromCdnImport() {
  try {
    const wasmModule = await import(/* webpackIgnore: true */ WASM_CDN_JS_URL);
    init = wasmModule.default;
    parse_sav_to_json = wasmModule.parse_sav_to_json;
    encode_json_to_sav = wasmModule.encode_json_to_sav;
    
    console.log("JS模块加载成功，正在初始化WASM...");
    
    // 初始化WASM模块
    await init(WASM_CDN_URL);
  } catch (error) {
    console.error("通过import加载模块失败:", error);
    throw error;
  }
}

// 方法2: 通过fetch加载CDN JS模块
async function loadFromCdnFetch() {
  const fetchOptions = {
    credentials: 'omit', // 不发送cookie
    mode: 'cors',
    cache: 'no-cache', // 不使用缓存
  };
  
  // 先加载JS
  const jsResponse = await fetch(WASM_CDN_JS_URL, fetchOptions);
  if (!jsResponse.ok) {
    throw new Error(`无法加载WASM JS文件: ${jsResponse.status} ${jsResponse.statusText}`);
  }
  
  // 评估JS模块
  const jsText = await jsResponse.text();
  const wasmModule = new Function('return ' + jsText)();
  
  init = wasmModule.default;
  parse_sav_to_json = wasmModule.parse_sav_to_json;
  encode_json_to_sav = wasmModule.encode_json_to_sav;
  
  // 加载WASM二进制
  await init(WASM_CDN_URL);
}

// 方法3: 从本地加载
async function loadFromLocalImport() {
  try {
    const wasmModule = await import(LOCAL_WASM_JS_URL);
    init = wasmModule.default;
    parse_sav_to_json = wasmModule.parse_sav_to_json;
    encode_json_to_sav = wasmModule.encode_json_to_sav;
    
    await init();
  } catch (error) {
    console.error("从本地加载模块失败:", error);
    throw error;
  }
}

// 方法4: 设置后备函数（仅提供UI功能，无实际处理能力）
async function setupFallbackFunctions() {
  console.warn("使用后备函数模式 - 仅提供UI功能，无法处理实际数据");
  
  // 创建模拟函数，返回固定数据
  parse_sav_to_json = (data) => {
    console.warn("使用模拟函数parse_sav_to_json");
    return JSON.stringify({
      root: {
        properties: {
          'Gold_0': { Int: 1000 },
          'InventoryItems_0': {
            Map: [
              { key: { Name: "sample_item_1" }, value: { Int: 1 } },
              { key: { Name: "sample_item_2" }, value: { Int: 1 } }
            ]
          }
        }
      }
    });
  };
  
  encode_json_to_sav = (jsonStr) => {
    console.warn("使用模拟函数encode_json_to_sav");
    // 返回一个空的Uint8Array作为模拟数据
    return new Uint8Array(10);
  };
  
  // 模拟init函数
  init = async () => {
    console.warn("使用模拟初始化函数");
    return true;
  };
  
  // 显示警告弹窗
  setTimeout(() => {
    alert("注意：WASM模块加载失败，当前处于有限功能模式。保存功能不可用。");
  }, 1000);
  
  return true;
}

/**
 * 确保 WASM 已初始化
 */
const ensureWasmReady = async () => {
  await initializeWasm();
  
  if (!wasmInitialized) {
    throw new Error('WASM 模块未正确初始化');
  }
};

/**
 * 解析 SAV 文件为 JSON 对象
 */
export const parseSavFile = async (data) => {
  // 输入验证
  if (!(data instanceof Uint8Array)) {
    throw new Error('输入数据必须是 Uint8Array 类型');
  }
  
  if (data.length === 0) {
    throw new Error('输入数据为空');
  }

  console.log(`📂 开始解析 SAV 文件，大小: ${data.length} 字节`);

  try {
    // 确保 WASM 已就绪
    await ensureWasmReady();
    
    // 调用 WASM 函数解析
    const jsonString = parse_sav_to_json(data);
    
    if (typeof jsonString !== 'string') {
      throw new Error(`WASM 函数返回类型错误，期望 string，实际 ${typeof jsonString}`);
    }

    if (!jsonString.trim()) {
      throw new Error('WASM 函数返回空字符串');
    }

    // 解析 JSON
    const jsonData = JSON.parse(jsonString);
    
    console.log(`✅ SAV 文件解析成功，JSON 大小: ${jsonString.length} 字符`);
    
    return jsonData;
    
  } catch (error) {
    console.error("❌ SAV 文件解析失败:", error);
    
    // 提供更详细的错误信息
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('failed to read save file')) {
        throw new Error('无法读取存档文件，请确认这是有效的 .sav 文件');
      } else if (message.includes('invalid utf-8')) {
        throw new Error('文件编码错误，可能文件已损坏');
      } else if (message.includes('unexpected eof')) {
        throw new Error('文件不完整，可能在传输过程中被截断');
      } else if (message.includes('json')) {
        throw new Error('JSON 解析错误，WASM 返回的数据格式异常');
      }
    }
    
    throw new Error(`SAV 解析失败: ${error}`);
  }
};

/**
 * 将 JSON 对象编码为 SAV 文件数据
 */
export const encodeSavFile = async (jsonData) => {
  // 输入验证
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('输入数据必须是有效的 JSON 对象');
  }

  try {
    const jsonString = JSON.stringify(jsonData);
    console.log(`📝 开始编码 JSON 为 SAV，JSON 大小: ${jsonString.length} 字符`);
    
    // 确保 WASM 已就绪
    await ensureWasmReady();
    
    // 调用 WASM 函数编码
    const savData = encode_json_to_sav(jsonString);
    
    if (!(savData instanceof Uint8Array)) {
      throw new Error(`WASM 函数返回类型错误，期望 Uint8Array，实际 ${typeof savData}`);
    }

    if (savData.length === 0) {
      throw new Error('WASM 函数返回空数据');
    }
    
    console.log(`✅ SAV 文件编码成功，大小: ${savData.length} 字节`);
    
    return savData;
    
  } catch (error) {
    console.error("❌ SAV 文件编码失败:", error);
    
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('failed to parse json')) {
        throw new Error('JSON 数据格式错误，无法转换为存档格式');
      } else if (message.includes('failed to write save file')) {
        throw new Error('无法生成存档文件，数据结构可能不完整');
      }
    }
    
    throw new Error(`SAV 编码失败: ${error}`);
  }
};

/**
 * 将修改后的物品清单更新回存档数据
 */
export const updateInventoryItems = (saveData, items) => {
  if (!saveData?.root?.properties) {
    throw new Error('无效的存档数据结构');
  }

  const updatedSaveData = JSON.parse(JSON.stringify(saveData)); // 深拷贝
  const properties = updatedSaveData.root.properties;
  
  // 更新所有 InventoryItems_ 属性
  Object.entries(properties).forEach(([key, value]) => {
    if (key.startsWith('InventoryItems_') && value && typeof value === 'object' && 'Map' in value) {
      value.Map = items;
      console.log(`🔄 更新了 ${key} 中的物品数据`);
    }
  });
  
  return updatedSaveData;
};

/**
 * 查找特定物品
 */
export const findInventoryItem = (items, itemName) => {
  return items.find(item => item.key?.Name === itemName);
};

/**
 * 更新特定物品的数量
 */
export const updateItemQuantity = (items, itemName, quantity) => {
  const updatedItems = [...items];
  const itemIndex = updatedItems.findIndex(item => item.key?.Name === itemName);
  
  if (itemIndex >= 0) {
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      value: {
        ...updatedItems[itemIndex].value,
        Int: quantity
      }
    };
  }
  
  return updatedItems;
};

/**
 * 分析 SAV 文件结构
 */
export const analyzeSavFile = (data) => {
  if (!(data instanceof Uint8Array)) {
    throw new Error('输入数据必须是 Uint8Array 类型');
  }

  const result = {
    size: data.length,
    hasValidHeader: false,
    properties: []
  };

  // 检查文件头
  if (data.length >= 4) {
    const header = new Uint8Array(data.slice(0, 4));
    result.hasValidHeader = header[0] === 0x47 && header[1] === 0x56 && header[2] === 0x41 && header[3] === 0x53;
  }

  return result;
};

/**
 * 获取 WASM 模块状态
 */
export const getWasmStatus = () => {
  return {
    initialized: wasmInitialized,
    isInitializing: !!initPromise,
    attempts: loadAttempts,
    usingFallback: wasmInitialized && parse_sav_to_json.toString().includes('console.warn')
  };
};

/**
 * 重置 WASM 模块状态
 */
export const resetWasm = () => {
  wasmInitialized = false;
  initPromise = null;
};

/**
 * 处理上传的文件
 */
export const processFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    return await parseSavFile(data);
  } catch (error) {
    console.error('文件处理失败:', error);
    throw new Error(`文件处理失败: ${error.message}`);
  }
};

/**
 * 下载文件
 */
export const downloadFile = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 加载 WASM 模块
 */
export const loadWasm = async () => {
  try {
    await initializeWasm();
    return true;
  } catch (error) {
    console.error('WASM 加载失败:', error);
    return false;
  }
}; 

/**
 * 从解析的存档数据中提取物品清单
 * 模仿 Python 版本的逻辑
 */
export const extractInventoryItems = (saveData) => {
  if (!saveData?.root?.properties) {
    console.warn('⚠️ 存档数据结构异常，未找到 root.properties');
    return [];
  }

  const inventoryItems = [];
  const properties = saveData.root.properties;
  
  // 查找所有以 InventoryItems_ 开头的属性
  Object.entries(properties).forEach(([key, value]) => {
    if (key.startsWith('InventoryItems_') && value && typeof value === 'object') {
      if ('Map' in value && Array.isArray(value.Map)) {
        inventoryItems.push(...value.Map);
        console.log(`📦 从 ${key} 中提取到 ${value.Map.length} 个物品`);
      }
    }
  });
  
  console.log(`📊 总共提取到 ${inventoryItems.length} 个物品条目`);
  
  return inventoryItems;
};

/**
 * 获取物品数据
 * 从本地存储或远程加载物品配置数据
 */
export const getItemsData = async () => {
  try {
    console.log('🔍 开始获取物品数据');
    
    // 尝试从本地缓存获取
    const cachedData = localStorage.getItem('itemsData');
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          console.log(`✅ 从本地缓存加载了 ${parsedData.length} 个物品数据`);
          return parsedData;
        }
      } catch (e) {
        console.warn('⚠️ 本地缓存数据解析失败，将重新获取');
      }
    }
    
  
  } catch (error) {
    console.error('❌ 获取物品数据失败:', error);
    
    // 返回模拟数据以便开发测试
    console.log('⚠️ 返回模拟数据用于开发测试');
    const mockData = generateMockItemsData();
    return mockData;
  }
};


