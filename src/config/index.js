
import devConfig  from './config.dev.json';
import prodConfig from './config.prod.json';

const MODE = import.meta.env.MODE;

const baseConfig =
    MODE === 'production'
        ? prodConfig
        : devConfig;


const pick = (...vals) => vals.find(v => v !== undefined);

const finalConfig = { ...baseConfig };

Object.keys(baseConfig).forEach(key => {
    const envValue = pick(
        import.meta.env[`REACT_${key}`],
        import.meta.env[`REACT_APP_${key}`],
        import.meta.env[`VITE_${key}`]
    );
    if (envValue !== undefined) finalConfig[key] = envValue;
});


export default finalConfig;
export const BASE_URL = finalConfig.BASE_URL;

