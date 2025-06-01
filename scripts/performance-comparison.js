#!/usr/bin/env node

const puppeteer = require('puppeteer')

// 性能测试配置
const testConfig = {
  production: {
    name: '线上环境',
    url: 'https://savefile.space',
    timeout: 30000
  },
  local: {
    name: '本地优化版本',
    url: 'http://localhost:3000',
    timeout: 30000
  }
}

// 网络条件预设
const networkPresets = {
  'fast3g': {
    name: 'Fast 3G',
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5Mbps
    uploadThroughput: 750 * 1024 / 8, // 750kbps
    latency: 150
  },
  'slow3g': {
    name: 'Slow 3G',
    downloadThroughput: 500 * 1024 / 8, // 500kbps
    uploadThroughput: 500 * 1024 / 8, // 500kbps
    latency: 400
  }
}

async function measurePerformance(url, networkCondition = null) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    
    // 设置网络条件
    if (networkCondition) {
      await page.emulateNetworkConditions(networkPresets[networkCondition])
      console.log(`应用网络条件: ${networkPresets[networkCondition].name}`)
    }
    
    // 启动性能监控
    await page.coverage.startJSCoverage()
    await page.coverage.startCSSCoverage()
    
    const startTime = Date.now()
    
    // 访问页面
    const response = await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    })
    
    const loadTime = Date.now() - startTime
    
    // 获取性能指标
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const paint = performance.getEntriesByType('paint')
      const resources = performance.getEntriesByType('resource')
      
      return {
        navigation: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstByte: navigation.responseStart - navigation.requestStart,
          domInteractive: navigation.domInteractive - navigation.navigationStart
        },
        paint: {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        },
        resources: {
          total: resources.length,
          scripts: resources.filter(r => r.initiatorType === 'script').length,
          stylesheets: resources.filter(r => r.initiatorType === 'link').length,
          images: resources.filter(r => r.initiatorType === 'img').length
        },
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
        } : null
      }
    })
    
    // 获取覆盖率数据
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage()
    ])
    
    const jsUsage = jsCoverage.reduce((acc, entry) => {
      return acc + entry.ranges.reduce((sum, range) => sum + range.end - range.start, 0)
    }, 0)
    
    const jsTotal = jsCoverage.reduce((acc, entry) => acc + entry.text.length, 0)
    
    return {
      url,
      loadTime,
      statusCode: response.status(),
      metrics,
      coverage: {
        js: {
          used: jsUsage,
          total: jsTotal,
          percentage: jsTotal > 0 ? Math.round((jsUsage / jsTotal) * 100) : 0
        }
      }
    }
    
  } finally {
    await browser.close()
  }
}

async function runComparison() {
  console.log('🚀 开始性能对比测试...\n')
  
  const results = {}
  
  for (const [env, config] of Object.entries(testConfig)) {
    console.log(`📊 测试 ${config.name} (${config.url})`)
    
    try {
      // 测试正常网络条件
      results[env] = await measurePerformance(config.url)
      console.log(`✅ ${config.name} 测试完成`)
      
      // 测试慢网络条件
      console.log(`📱 测试 ${config.name} - Slow 3G`)
      results[`${env}_slow3g`] = await measurePerformance(config.url, 'slow3g')
      console.log(`✅ ${config.name} - Slow 3G 测试完成`)
      
    } catch (error) {
      console.error(`❌ ${config.name} 测试失败:`, error.message)
      results[env] = { error: error.message }
    }
    
    console.log('')
  }
  
  // 输出对比结果
  console.log('📈 性能对比结果:')
  console.log('=' .repeat(80))
  
  const environments = Object.keys(testConfig)
  
  environments.forEach(env => {
    const result = results[env]
    const slowResult = results[`${env}_slow3g`]
    
    if (result && !result.error) {
      console.log(`\n🌐 ${testConfig[env].name}:`)
      console.log(`   页面加载时间: ${result.loadTime}ms`)
      console.log(`   首字节时间 (TTFB): ${result.metrics.navigation.firstByte.toFixed(0)}ms`)
      console.log(`   首次内容绘制 (FCP): ${result.metrics.paint.firstContentfulPaint.toFixed(0)}ms`)
      console.log(`   DOM 交互时间: ${result.metrics.navigation.domInteractive.toFixed(0)}ms`)
      console.log(`   资源总数: ${result.metrics.resources.total}`)
      console.log(`   JavaScript 使用率: ${result.coverage.js.percentage}%`)
      
      if (result.metrics.memory) {
        console.log(`   内存使用: ${result.metrics.memory.used}MB`)
      }
      
      if (slowResult && !slowResult.error) {
        console.log(`   [Slow 3G] 加载时间: ${slowResult.loadTime}ms`)
        console.log(`   [Slow 3G] FCP: ${slowResult.metrics.paint.firstContentfulPaint.toFixed(0)}ms`)
      }
    }
  })
  
  // 性能对比分析
  if (results.production && results.local && !results.production.error && !results.local.error) {
    console.log('\n📊 对比分析:')
    console.log('-' .repeat(50))
    
    const prodLoad = results.production.loadTime
    const localLoad = results.local.loadTime
    const loadDiff = ((localLoad - prodLoad) / prodLoad * 100).toFixed(1)
    
    console.log(`页面加载时间差异: ${loadDiff}% ${loadDiff > 0 ? '(本地较慢)' : '(本地较快)'}`)
    
    const prodFCP = results.production.metrics.paint.firstContentfulPaint
    const localFCP = results.local.metrics.paint.firstContentfulPaint
    const fcpDiff = ((localFCP - prodFCP) / prodFCP * 100).toFixed(1)
    
    console.log(`FCP 差异: ${fcpDiff}% ${fcpDiff > 0 ? '(本地较慢)' : '(本地较快)'}`)
    
    const prodResources = results.production.metrics.resources.total
    const localResources = results.local.metrics.resources.total
    const resourceDiff = localResources - prodResources
    
    console.log(`资源数量差异: ${resourceDiff > 0 ? '+' : ''}${resourceDiff}`)
    
    const prodJS = results.production.coverage.js.percentage
    const localJS = results.local.coverage.js.percentage
    const jsDiff = (localJS - prodJS).toFixed(1)
    
    console.log(`JavaScript 使用率差异: ${jsDiff > 0 ? '+' : ''}${jsDiff}%`)
  }
  
  console.log('\n🎯 优化建议:')
  console.log('-' .repeat(50))
  
  if (results.local && !results.local.error) {
    const local = results.local
    
    if (local.metrics.paint.firstContentfulPaint > 2000) {
      console.log('• FCP 超过 2 秒，建议优化关键渲染路径')
    }
    
    if (local.metrics.resources.total > 50) {
      console.log('• 资源数量较多，建议合并或延迟加载非关键资源')
    }
    
    if (local.coverage.js.percentage < 50) {
      console.log('• JavaScript 使用率较低，建议代码分割和按需加载')
    }
    
    if (local.loadTime > 5000) {
      console.log('• 页面加载时间较长，建议启用缓存和 CDN')
    }
  }
  
  console.log('\n✨ 测试完成!')
}

// 检查依赖
async function checkDependencies() {
  try {
    require('puppeteer')
    return true
  } catch (error) {
    console.error('❌ 缺少依赖: puppeteer')
    console.log('请运行: npm install puppeteer')
    return false
  }
}

// 主函数
async function main() {
  if (!(await checkDependencies())) {
    process.exit(1)
  }
  
  await runComparison()
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { measurePerformance, runComparison } 