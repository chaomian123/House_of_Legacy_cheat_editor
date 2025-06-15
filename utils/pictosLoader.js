export const loadPictos = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load Pictos file: ${response.statusText}`);
    }
    const text = await response.text();
    return text.split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('Error loading Pictos:', error);
    throw error;
  }
}; 