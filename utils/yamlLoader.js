import yaml from 'js-yaml';

export const loadYaml = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load YAML file: ${response.statusText}`);
    }
    const text = await response.text();
    return yaml.load(text);
  } catch (error) {
    console.error('Error loading YAML:', error);
    throw error;
  }
}; 