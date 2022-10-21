import * as os from "os";
import cluster from "cluster";

import App from "./providers/App";

App.loadDatabase();
App.loadServer();
// App.loadCron();
