import { CoreSetup, CoreStart, Plugin } from 'opensearch-dashboards/public';
import {
  AppPluginStartDependencies,
  WazuhFleetPluginSetup,
  WazuhFleetPluginStart,
} from './types';
import { FleetManagement } from './components';
import { setCore, setWazuhCore } from './plugin-services';

export class WazuhFleetPlugin
  implements Plugin<WazuhFleetPluginSetup, WazuhFleetPluginStart>
{
  public setup(core: CoreSetup): WazuhFleetPluginSetup {
    return {};
  }

  public start(
    core: CoreStart,
    plugins: AppPluginStartDependencies,
  ): WazuhFleetPluginStart {
    setCore(core);
    setWazuhCore(plugins.wazuhCore);

    return {
      FleetManagement,
    };
  }

  public stop() {}
}
