import { ConfigPlugin, ExportedConfig, Modifier, ModifierPlatform } from '../Plugin.types';

function ensureArray<T>(input: T | T[]): T[] {
  if (Array.isArray(input)) {
    return input;
  }
  return [input];
}

type AppliedConfigPlugin<T = any> = ConfigPlugin<T> | [ConfigPlugin<T>, T];

/**
 * Plugin to chain a list of plugins together.
 *
 * @param config exported config
 * @param plugins list of config config plugins to apply to the exported config
 */
export const withPlugins: ConfigPlugin<AppliedConfigPlugin[]> = (
  config,
  plugins
): ExportedConfig => {
  return plugins.reduce((prev, curr) => {
    const [plugins, args] = ensureArray(curr);
    return plugins(prev, args);
  }, config);
};

/**
 * Plugin to extend a modifier function in the plugins config.
 *
 * @param config exported config
 * @param platform platform to target (ios or android)
 * @param modifier name of the platform function to extend
 * @param action method to run on the modifier when the config is compiled
 */
export function withExtendedModifier<T>(
  config: ExportedConfig,
  {
    platform,
    modifier,
    action,
  }: {
    platform: ModifierPlatform;
    modifier: string;
    action: Modifier<T>;
  }
): ExportedConfig {
  return withInterceptedModifier(config, {
    platform,
    modifier,
    async action({ modRequest: { nextModifier, ...modRequest }, modResults, ...config }) {
      const results = await action({ modRequest, modResults: modResults as T, ...config });
      return nextModifier!(results as any);
    },
  });
}

export function withInterceptedModifier<T>(
  config: ExportedConfig,
  {
    platform,
    modifier,
    action,
  }: {
    platform: ModifierPlatform;
    modifier: string;
    action: Modifier<T, T>;
  }
): ExportedConfig {
  if (!config.modifiers) {
    config.modifiers = {};
  }
  if (!config.modifiers[platform]) {
    config.modifiers[platform] = {};
  }

  const modifierPlugin: Modifier<T> =
    (config.modifiers[platform] as Record<string, any>)[modifier] ?? (config => config);

  const extendedModifier: Modifier<T> = async ({ modRequest, ...config }) => {
    // console.log(`-[mod]-> ${platform}.${modifier}`);
    return action({ ...config, modRequest: { ...modRequest, nextModifier: modifierPlugin } });
  };

  (config.modifiers[platform] as any)[modifier] = extendedModifier;

  return config;
}
