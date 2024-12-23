var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/slack-edge/dist/request/request-parser.js
var require_request_parser = __commonJS({
  "node_modules/slack-edge/dist/request/request-parser.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseRequestBody = parseRequestBody;
    async function parseRequestBody(requestHeaders, requestBody) {
      const contentType = requestHeaders.get("content-type");
      if (contentType?.startsWith("application/json") || requestBody.startsWith("{")) {
        return JSON.parse(requestBody);
      }
      const params = new URLSearchParams(requestBody);
      if (params.has("payload")) {
        const payload = params.get("payload");
        return JSON.parse(payload);
      }
      const formBody = {};
      for (const k of params.keys()) {
        formBody[k] = params.get(k);
      }
      return formBody;
    }
    __name(parseRequestBody, "parseRequestBody");
  }
});

// node_modules/slack-edge/dist/request/request-verification.js
var require_request_verification = __commonJS({
  "node_modules/slack-edge/dist/request/request-verification.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifySlackRequest = verifySlackRequest;
    async function verifySlackRequest(signingSecret, requestHeaders, requestBody) {
      const timestampHeader = requestHeaders.get("x-slack-request-timestamp");
      if (!timestampHeader) {
        console.log("x-slack-request-timestamp header is missing!");
        return false;
      }
      const fiveMinutesAgoSeconds = Math.floor(Date.now() / 1e3) - 60 * 5;
      if (Number.parseInt(timestampHeader) < fiveMinutesAgoSeconds) {
        return false;
      }
      const signatureHeader = requestHeaders.get("x-slack-signature");
      if (!timestampHeader || !signatureHeader) {
        console.log("x-slack-signature header is missing!");
        return false;
      }
      const textEncoder = new TextEncoder();
      return await crypto.subtle.verify("HMAC", await crypto.subtle.importKey("raw", textEncoder.encode(signingSecret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]), fromHexStringToBytes(signatureHeader.substring(3)), textEncoder.encode(`v0:${timestampHeader}:${requestBody}`));
    }
    __name(verifySlackRequest, "verifySlackRequest");
    function fromHexStringToBytes(hexString) {
      const bytes = new Uint8Array(hexString.length / 2);
      for (let idx = 0; idx < hexString.length; idx += 2) {
        bytes[idx / 2] = parseInt(hexString.substring(idx, idx + 2), 16);
      }
      return bytes;
    }
    __name(fromHexStringToBytes, "fromHexStringToBytes");
  }
});

// node_modules/slack-edge/dist/response/response.js
var require_response = __commonJS({
  "node_modules/slack-edge/dist/response/response.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toCompleteResponse = toCompleteResponse;
    function toCompleteResponse(slackResponse) {
      if (!slackResponse) {
        return new Response("", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      }
      if (typeof slackResponse === "string") {
        return new Response(slackResponse, {
          status: 200,
          headers: { "Content-Type": "text/plain;charset=utf-8" }
        });
      }
      let completeResponse = {};
      if (Object.prototype.hasOwnProperty.call(slackResponse, "text") || Object.prototype.hasOwnProperty.call(slackResponse, "blocks")) {
        completeResponse = { status: 200, body: slackResponse };
      } else if (Object.prototype.hasOwnProperty.call(slackResponse, "response_action")) {
        completeResponse = { status: 200, body: slackResponse };
      } else if (Object.prototype.hasOwnProperty.call(slackResponse, "options") || Object.prototype.hasOwnProperty.call(slackResponse, "option_groups")) {
        completeResponse = { status: 200, body: slackResponse };
      } else {
        completeResponse = slackResponse;
      }
      const status = completeResponse.status ? completeResponse.status : 200;
      let contentType = completeResponse.contentType ? completeResponse.contentType : "text/plain;charset=utf-8";
      let bodyString = "";
      if (typeof completeResponse.body === "object") {
        contentType = "application/json;charset=utf-8";
        bodyString = JSON.stringify(completeResponse.body);
      } else {
        bodyString = completeResponse.body || "";
      }
      return new Response(bodyString, {
        status,
        headers: { "Content-Type": contentType }
      });
    }
    __name(toCompleteResponse, "toCompleteResponse");
  }
});

// node_modules/slack-web-api-client/dist/block-kit/block-elements.js
var require_block_elements = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/block-elements.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/blocks.js
var require_blocks = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/blocks.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/confirm.js
var require_confirm = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/confirm.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/link-unfurls.js
var require_link_unfurls = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/link-unfurls.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/message-attachment.js
var require_message_attachment = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/message-attachment.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/message-metadata.js
var require_message_metadata = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/message-metadata.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/options.js
var require_options = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/options.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/text-fields.js
var require_text_fields = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/text-fields.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/rich-text-block.js
var require_rich_text_block = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/rich-text-block.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/block-kit/views.js
var require_views = __commonJS({
  "node_modules/slack-web-api-client/dist/block-kit/views.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/client/api-client-options.js
var require_api_client_options = __commonJS({
  "node_modules/slack-web-api-client/dist/client/api-client-options.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/errors.js
var require_errors = __commonJS({
  "node_modules/slack-web-api-client/dist/errors.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebhookError = exports.TokenRotationError = exports.SlackAPIError = exports.SlackAPIConnectionError = void 0;
    var SlackAPIConnectionError = class extends Error {
      constructor(apiName, status, body, headers, cause) {
        const substring = body.replaceAll("\r", "").replaceAll("\n", "").substring(0, 100);
        const bodyToPrint = substring.length === 1e3 ? substring + " ..." : substring;
        const message = cause !== void 0 ? `Failed to call ${apiName} (cause: ${cause})` : `Failed to call ${apiName} (status: ${status}, body: ${bodyToPrint})`;
        super(message);
        this.name = "SlackAPIConnectionError";
        this.apiName = apiName;
        this.status = status;
        this.body = body;
        this.headers = headers;
        this.cause = cause;
      }
    };
    __name(SlackAPIConnectionError, "SlackAPIConnectionError");
    exports.SlackAPIConnectionError = SlackAPIConnectionError;
    var SlackAPIError = class extends Error {
      constructor(apiName, error, result) {
        const resultToPrint = JSON.stringify(result);
        const message = `Failed to call ${apiName} due to ${error}: ${resultToPrint}`;
        super(message);
        this.name = "SlackAPIError";
        this.apiName = apiName;
        this.error = error;
        this.result = result;
      }
    };
    __name(SlackAPIError, "SlackAPIError");
    exports.SlackAPIError = SlackAPIError;
    var TokenRotationError = class extends Error {
      constructor(message, cause) {
        super(message);
        this.name = "TokenRotationError";
        this.cause = cause;
      }
    };
    __name(TokenRotationError, "TokenRotationError");
    exports.TokenRotationError = TokenRotationError;
    var WebhookError = class extends Error {
      constructor(status, body, cause = void 0) {
        const message = cause ? `Failed to send a message using incoming webhook/response_url (cause: ${cause})` : `Failed to send a message using incoming webhook/response_url (status: ${status}, body: ${body})`;
        super(message);
        this.name = "WebhookError";
        this.status = status;
        this.body = body;
        this.cause = cause;
      }
    };
    __name(WebhookError, "WebhookError");
    exports.WebhookError = WebhookError;
  }
});

// node_modules/slack-web-api-client/dist/logging/logging-level.js
var require_logging_level = __commonJS({
  "node_modules/slack-web-api-client/dist/logging/logging-level.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/logging/debug-logging.js
var require_debug_logging = __commonJS({
  "node_modules/slack-web-api-client/dist/logging/debug-logging.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isDebugLogEnabled = isDebugLogEnabled;
    exports.prettyPrint = prettyPrint;
    function isDebugLogEnabled(logLevel) {
      return logLevel !== void 0 && logLevel !== null && logLevel.toUpperCase() === "DEBUG";
    }
    __name(isDebugLogEnabled, "isDebugLogEnabled");
    function prettyPrint(obj) {
      return JSON.stringify(obj, null, 2);
    }
    __name(prettyPrint, "prettyPrint");
  }
});

// node_modules/slack-web-api-client/dist/logging/index.js
var require_logging = __commonJS({
  "node_modules/slack-web-api-client/dist/logging/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_logging_level(), exports);
    __exportStar(require_debug_logging(), exports);
  }
});

// node_modules/slack-web-api-client/dist/client/retry-handler/retry-handler.js
var require_retry_handler = __commonJS({
  "node_modules/slack-web-api-client/dist/client/retry-handler/retry-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/client/retry-handler/built-in.js
var require_built_in = __commonJS({
  "node_modules/slack-web-api-client/dist/client/retry-handler/built-in.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _RatelimitRetryHandler_maxAttempts;
    var _ConnectionErrorRetryHandler_maxAttempts;
    var _ConnectionErrorRetryHandler_intervalSeconds;
    var _ServerErrorRetryHandler_maxAttempts;
    var _ServerErrorRetryHandler_intervalSeconds;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerErrorRetryHandler = exports.ConnectionErrorRetryHandler = exports.RatelimitRetryHandler = exports.DefaultFixedIntervalRetryHandlerOptions = exports.DefaultBasicRetryHandlerOptions = void 0;
    var errors_1 = require_errors();
    exports.DefaultBasicRetryHandlerOptions = {
      maxAttempts: 1
    };
    exports.DefaultFixedIntervalRetryHandlerOptions = {
      maxAttempts: 1,
      intervalSeconds: 0.3
    };
    var RatelimitRetryHandler = class {
      constructor(options = exports.DefaultBasicRetryHandlerOptions) {
        _RatelimitRetryHandler_maxAttempts.set(this, void 0);
        __classPrivateFieldSet(this, _RatelimitRetryHandler_maxAttempts, options.maxAttempts, "f");
      }
      async shouldRetry({ state, response }) {
        if (state.currentAttempt >= __classPrivateFieldGet(this, _RatelimitRetryHandler_maxAttempts, "f") || !response) {
          return false;
        }
        if (response.status !== 429) {
          return false;
        }
        const retryAfter = response.headers.get("retry-after") || response.headers.get("Retry-After");
        if (!retryAfter || Number.isNaN(retryAfter)) {
          return false;
        }
        const sleepSeconds = Number.parseFloat(retryAfter);
        await sleep(sleepSeconds);
        return true;
      }
    };
    __name(RatelimitRetryHandler, "RatelimitRetryHandler");
    exports.RatelimitRetryHandler = RatelimitRetryHandler;
    _RatelimitRetryHandler_maxAttempts = /* @__PURE__ */ new WeakMap();
    var ConnectionErrorRetryHandler = class {
      constructor(options = exports.DefaultFixedIntervalRetryHandlerOptions) {
        _ConnectionErrorRetryHandler_maxAttempts.set(this, void 0);
        _ConnectionErrorRetryHandler_intervalSeconds.set(this, void 0);
        __classPrivateFieldSet(this, _ConnectionErrorRetryHandler_maxAttempts, options.maxAttempts, "f");
        __classPrivateFieldSet(this, _ConnectionErrorRetryHandler_intervalSeconds, options.intervalSeconds, "f");
      }
      async shouldRetry({ state, error }) {
        if (state.currentAttempt >= __classPrivateFieldGet(this, _ConnectionErrorRetryHandler_maxAttempts, "f") || !error) {
          return false;
        }
        if (error instanceof errors_1.SlackAPIConnectionError) {
          await sleep(__classPrivateFieldGet(this, _ConnectionErrorRetryHandler_intervalSeconds, "f"));
          return true;
        }
        return false;
      }
    };
    __name(ConnectionErrorRetryHandler, "ConnectionErrorRetryHandler");
    exports.ConnectionErrorRetryHandler = ConnectionErrorRetryHandler;
    _ConnectionErrorRetryHandler_maxAttempts = /* @__PURE__ */ new WeakMap(), _ConnectionErrorRetryHandler_intervalSeconds = /* @__PURE__ */ new WeakMap();
    var ServerErrorRetryHandler = class {
      constructor(options = exports.DefaultFixedIntervalRetryHandlerOptions) {
        _ServerErrorRetryHandler_maxAttempts.set(this, void 0);
        _ServerErrorRetryHandler_intervalSeconds.set(this, void 0);
        __classPrivateFieldSet(this, _ServerErrorRetryHandler_maxAttempts, options.maxAttempts, "f");
        __classPrivateFieldSet(this, _ServerErrorRetryHandler_intervalSeconds, options.intervalSeconds, "f");
      }
      async shouldRetry({ state, response }) {
        if (state.currentAttempt >= __classPrivateFieldGet(this, _ServerErrorRetryHandler_maxAttempts, "f") || !response) {
          return false;
        }
        if (response.status >= 500) {
          await sleep(__classPrivateFieldGet(this, _ServerErrorRetryHandler_intervalSeconds, "f"));
          return true;
        }
        return false;
      }
    };
    __name(ServerErrorRetryHandler, "ServerErrorRetryHandler");
    exports.ServerErrorRetryHandler = ServerErrorRetryHandler;
    _ServerErrorRetryHandler_maxAttempts = /* @__PURE__ */ new WeakMap(), _ServerErrorRetryHandler_intervalSeconds = /* @__PURE__ */ new WeakMap();
    var sleep = /* @__PURE__ */ __name((seconds) => {
      return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
    }, "sleep");
  }
});

// node_modules/slack-web-api-client/dist/client/retry-handler/index.js
var require_retry_handler2 = __commonJS({
  "node_modules/slack-web-api-client/dist/client/retry-handler/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_retry_handler(), exports);
    __exportStar(require_built_in(), exports);
  }
});

// node_modules/slack-web-api-client/dist/client/api-client.js
var require_api_client = __commonJS({
  "node_modules/slack-web-api-client/dist/client/api-client.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _SlackAPIClient_instances;
    var _a;
    var _SlackAPIClient_token;
    var _SlackAPIClient_options;
    var _SlackAPIClient_logLevel;
    var _SlackAPIClient_throwSlackAPIError;
    var _SlackAPIClient_baseUrl;
    var _SlackAPIClient_sendMultipartData;
    var _SlackAPIClient_uploadFilesV2;
    var _SlackAPIClient_bindApiCall;
    var _SlackAPIClient_bindNoArgAllowedApiCall;
    var _SlackAPIClient_bindMultipartApiCall;
    var _SlackAPIClient_bindFilesUploadV2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SlackAPIClient = void 0;
    var errors_1 = require_errors();
    var index_1 = require_logging();
    var index_2 = require_retry_handler2();
    var defaultOptions = {
      logLevel: "INFO",
      throwSlackAPIError: true,
      baseUrl: "https://slack.com/api/"
    };
    var SlackAPIClient = class {
      constructor(token = void 0, options = defaultOptions) {
        _SlackAPIClient_instances.add(this);
        _SlackAPIClient_token.set(this, void 0);
        _SlackAPIClient_options.set(this, void 0);
        _SlackAPIClient_logLevel.set(this, void 0);
        _SlackAPIClient_throwSlackAPIError.set(this, void 0);
        _SlackAPIClient_baseUrl.set(this, void 0);
        this.admin = {
          apps: {
            approve: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.apps.approve"),
            approved: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.apps.approved.list")
            },
            clearResolution: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.apps.clearResolution"),
            requests: {
              cancel: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.apps.requests.cancel"),
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.apps.requests.list")
            },
            restrict: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.apps.restrict"),
            restricted: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.apps.restricted.list")
            },
            uninstall: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.apps.uninstall"),
            activities: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.apps.activities.list")
            }
          },
          auth: {
            policy: {
              assignEntities: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.auth.policy.assignEntities"),
              getEntities: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.auth.policy.getEntities"),
              removeEntities: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.auth.policy.removeEntities")
            }
          },
          barriers: {
            create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.barriers.create"),
            delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.barriers.delete"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.barriers.list"),
            update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.barriers.update")
          },
          conversations: {
            archive: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.archive"),
            bulkArchive: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.bulkArchive"),
            bulkDelete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.bulkDelete"),
            bulkMove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.bulkMove"),
            convertToPrivate: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.convertToPrivate"),
            convertToPublic: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.convertToPublic"),
            create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.create"),
            delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.delete"),
            disconnectShared: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.disconnectShared"),
            ekm: {
              listOriginalConnectedChannelInfo: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.conversations.ekm.listOriginalConnectedChannelInfo")
            },
            getConversationPrefs: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.getConversationPrefs"),
            getTeams: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.getTeams"),
            invite: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.invite"),
            rename: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.rename"),
            restrictAccess: {
              addGroup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.restrictAccess.addGroup"),
              listGroups: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.restrictAccess.listGroups"),
              removeGroup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.restrictAccess.removeGroup")
            },
            requestSharedInvite: {
              approve: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.requestSharedInvite.approve"),
              deny: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.requestSharedInvite.deny"),
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.requestSharedInvite.list")
            },
            getCustomRetention: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.getCustomRetention"),
            setCustomRetention: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.setCustomRetention"),
            removeCustomRetention: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.removeCustomRetention"),
            lookup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.lookup"),
            search: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.conversations.search"),
            setConversationPrefs: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.setConversationPrefs"),
            setTeams: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.setTeams"),
            unarchive: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.conversations.unarchive")
          },
          emoji: {
            add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.emoji.add"),
            addAlias: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.emoji.addAlias"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.emoji.list"),
            remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.emoji.remove"),
            rename: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.emoji.rename")
          },
          functions: {
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.functions.list"),
            permissions: {
              lookup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.functions.permissions.lookup"),
              set: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.functions.permissions.set")
            }
          },
          inviteRequests: {
            approve: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.inviteRequests.approve"),
            approved: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.inviteRequests.approved.list")
            },
            denied: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.inviteRequests.denied.list")
            },
            deny: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.inviteRequests.deny"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.inviteRequests.list")
          },
          roles: {
            addAssignments: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.roles.addAssignments"),
            listAssignments: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.roles.listAssignments"),
            removeAssignments: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.roles.removeAssignments")
          },
          teams: {
            admins: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.admins.list")
            },
            create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.create"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.teams.list"),
            owners: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.owners.list")
            },
            settings: {
              info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.settings.info"),
              setDefaultChannels: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.settings.setDefaultChannels"),
              setDescription: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.settings.setDescription"),
              setDiscoverability: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.settings.setDiscoverability"),
              setIcon: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.settings.setIcon"),
              setName: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.teams.settings.setName")
            }
          },
          usergroups: {
            addChannels: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.usergroups.addChannels"),
            addTeams: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.usergroups.addTeams"),
            listChannels: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.usergroups.listChannels"),
            removeChannels: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.usergroups.removeChannels")
          },
          users: {
            assign: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.assign"),
            invite: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.invite"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.list"),
            remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.remove"),
            session: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.users.session.list"),
              reset: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.session.reset"),
              resetBulk: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.session.resetBulk"),
              invalidate: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.session.invalidate"),
              getSettings: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.session.getSettings"),
              setSettings: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.session.setSettings"),
              clearSettings: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.session.clearSettings")
            },
            unsupportedVersions: {
              export: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.users.unsupportedVersions.export")
            },
            setAdmin: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.setAdmin"),
            setExpiration: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.setExpiration"),
            setOwner: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.setOwner"),
            setRegular: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.users.setRegular")
          },
          workflows: {
            search: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "admin.workflows.search"),
            unpublish: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.workflows.unpublish"),
            collaborators: {
              add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.workflows.collaborators.add"),
              remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.workflows.collaborators.remove")
            },
            permissions: {
              lookup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "admin.workflows.permissions.lookup")
            }
          }
        };
        this.api = {
          test: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "api.test")
        };
        this.apps = {
          connections: {
            open: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "apps.connections.open")
          },
          datastore: {
            put: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.datastore.put"),
            update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.datastore.update"),
            get: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.datastore.get"),
            query: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.datastore.query"),
            delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.datastore.delete")
          },
          event: {
            authorizations: {
              list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.event.authorizations.list")
            }
          },
          manifest: {
            create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.manifest.create"),
            delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.manifest.delete"),
            update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.manifest.update"),
            export: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.manifest.export"),
            validate: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.manifest.validate")
          },
          uninstall: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "apps.uninstall")
        };
        this.assistant = {
          threads: {
            setStatus: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "assistant.threads.setStatus"),
            setSuggestedPrompts: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "assistant.threads.setSuggestedPrompts"),
            setTitle: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "assistant.threads.setTitle")
          }
        };
        this.auth = {
          revoke: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "auth.revoke"),
          teams: {
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "auth.teams.list")
          },
          test: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "auth.test")
        };
        this.bots = {
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "bots.info")
        };
        this.bookmarks = {
          add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "bookmarks.add"),
          edit: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "bookmarks.edit"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "bookmarks.list"),
          remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "bookmarks.remove")
        };
        this.canvases = {
          access: {
            delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "canvases.access.delete"),
            set: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "canvases.access.set")
          },
          create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "canvases.create"),
          edit: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "canvases.edit"),
          delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "canvases.delete"),
          sections: {
            lookup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "canvases.sections.lookup")
          }
        };
        this.chat = {
          delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.delete"),
          deleteScheduledMessage: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.deleteScheduledMessage"),
          getPermalink: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.getPermalink"),
          meMessage: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.meMessage"),
          postEphemeral: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.postEphemeral"),
          postMessage: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.postMessage"),
          scheduleMessage: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.scheduleMessage"),
          scheduledMessages: {
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.scheduledMessages.list")
          },
          unfurl: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.unfurl"),
          update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "chat.update")
        };
        this.conversations = {
          acceptSharedInvite: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.acceptSharedInvite"),
          approveSharedInvite: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.approveSharedInvite"),
          archive: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.archive"),
          close: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.close"),
          create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.create"),
          declineSharedInvite: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.declineSharedInvite"),
          history: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.history"),
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.info"),
          invite: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.invite"),
          inviteShared: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.inviteShared"),
          join: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.join"),
          kick: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.kick"),
          leave: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.leave"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "conversations.list"),
          listConnectInvites: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "conversations.listConnectInvites"),
          mark: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.mark"),
          members: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.members"),
          open: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "conversations.open"),
          rename: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.rename"),
          replies: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.replies"),
          setPurpose: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.setPurpose"),
          setTopic: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.setTopic"),
          unarchive: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.unarchive"),
          canvases: {
            create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.canvases.create")
          },
          externalInvitePermissions: {
            set: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "conversations.externalInvitePermissions.set")
          }
        };
        this.dnd = {
          endDnd: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "dnd.endDnd"),
          endSnooze: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "dnd.endSnooze"),
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "dnd.info"),
          setSnooze: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "dnd.setSnooze"),
          teamInfo: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "dnd.teamInfo")
        };
        this.emoji = {
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "emoji.list")
        };
        this.files = {
          delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.delete"),
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.info"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "files.list"),
          revokePublicURL: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.revokePublicURL"),
          sharedPublicURL: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.sharedPublicURL"),
          /**
           * @deprecated use files.uploadV2 instead
           */
          upload: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindMultipartApiCall).call(this, this, "files.upload"),
          uploadV2: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindFilesUploadV2).call(this, this),
          getUploadURLExternal: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.getUploadURLExternal"),
          completeUploadExternal: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.completeUploadExternal"),
          remote: {
            info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "files.remote.info"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "files.remote.list"),
            add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.remote.add"),
            update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "files.remote.update"),
            remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "files.remote.remove"),
            share: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "files.remote.share")
          }
        };
        this.functions = {
          completeSuccess: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "functions.completeSuccess"),
          completeError: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "functions.completeError")
        };
        this.migration = {
          exchange: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "migration.exchange")
        };
        this.oauth = {
          v2: {
            access: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "oauth.v2.access"),
            exchange: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "oauth.v2.exchange")
          }
        };
        this.openid = {
          connect: {
            token: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "openid.connect.token"),
            userInfo: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "openid.connect.userInfo")
          }
        };
        this.pins = {
          add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "pins.add"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "pins.list"),
          remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "pins.remove")
        };
        this.reactions = {
          add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "reactions.add"),
          get: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "reactions.get"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "reactions.list"),
          remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "reactions.remove")
        };
        this.reminders = {
          add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "reminders.add"),
          complete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "reminders.complete"),
          delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "reminders.delete"),
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "reminders.info"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "reminders.list")
        };
        this.search = {
          all: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "search.all"),
          files: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "search.files"),
          messages: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "search.messages")
        };
        this.stars = {
          add: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "stars.add"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "stars.list"),
          remove: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "stars.remove")
        };
        this.team = {
          accessLogs: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.accessLogs"),
          billableInfo: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.billableInfo"),
          billing: {
            info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.billing.info")
          },
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.info"),
          integrationLogs: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.integrationLogs"),
          preferences: {
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.preferences.list")
          },
          profile: {
            get: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "team.profile.get")
          },
          externalTeams: {
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "team.externalTeams.list"),
            disconnect: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "team.externalTeams.disconnect")
          }
        };
        this.tooling = {
          tokens: {
            rotate: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "tooling.tokens.rotate")
          }
        };
        this.usergroups = {
          create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "usergroups.create"),
          disable: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "usergroups.disable"),
          enable: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "usergroups.enable"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "usergroups.list"),
          update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "usergroups.update"),
          users: {
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "usergroups.users.list"),
            update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "usergroups.users.update")
          }
        };
        this.users = {
          conversations: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.conversations"),
          deletePhoto: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.deletePhoto"),
          getPresence: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.getPresence"),
          identity: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.identity"),
          info: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "users.info"),
          list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.list"),
          lookupByEmail: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "users.lookupByEmail"),
          setPhoto: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "users.setPhoto"),
          setPresence: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "users.setPresence"),
          profile: {
            get: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.profile.get"),
            set: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "users.profile.set")
          },
          discoverableContacts: {
            lookup: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "users.discoverableContacts.lookup")
          }
        };
        this.views = {
          open: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "views.open"),
          publish: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "views.publish"),
          push: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "views.push"),
          update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "views.update")
        };
        this.workflows = {
          triggers: {
            create: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "workflows.triggers.create"),
            update: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "workflows.triggers.update"),
            delete: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindApiCall).call(this, this, "workflows.triggers.delete"),
            list: __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_bindNoArgAllowedApiCall).call(this, this, "workflows.triggers.list")
          }
        };
        __classPrivateFieldSet(this, _SlackAPIClient_token, token, "f");
        __classPrivateFieldSet(this, _SlackAPIClient_options, options, "f");
        __classPrivateFieldSet(this, _SlackAPIClient_logLevel, __classPrivateFieldGet(this, _SlackAPIClient_options, "f").logLevel ?? defaultOptions.logLevel, "f");
        __classPrivateFieldSet(this, _SlackAPIClient_throwSlackAPIError, __classPrivateFieldGet(this, _SlackAPIClient_options, "f").throwSlackAPIError ?? true, "f");
        __classPrivateFieldSet(this, _SlackAPIClient_baseUrl, __classPrivateFieldGet(this, _SlackAPIClient_options, "f").baseUrl ? __classPrivateFieldGet(this, _SlackAPIClient_options, "f").baseUrl.endsWith("/") ? __classPrivateFieldGet(this, _SlackAPIClient_options, "f").baseUrl : __classPrivateFieldGet(this, _SlackAPIClient_options, "f").baseUrl + "/" : defaultOptions.baseUrl, "f");
        this.retryHandlers = __classPrivateFieldGet(this, _SlackAPIClient_options, "f").retryHandlers ?? [new index_2.RatelimitRetryHandler()];
      }
      // --------------------------------------
      // Internal methods
      // --------------------------------------
      async call(name, params = {}, retryHandlerState = void 0) {
        const url = `${__classPrivateFieldGet(this, _SlackAPIClient_baseUrl, "f")}${name}`;
        const token = params ? params.token ?? __classPrivateFieldGet(this, _SlackAPIClient_token, "f") : __classPrivateFieldGet(this, _SlackAPIClient_token, "f");
        const _params = {};
        Object.assign(_params, params);
        if (_params && _params.token) {
          delete _params.token;
        }
        for (const [key, value] of Object.entries(_params)) {
          if (typeof value === "object") {
            if (Array.isArray(value) && value.length > 0 && typeof value[0] !== "object") {
              _params[key] = value.map((v) => v.toString()).join(",");
            } else {
              _params[key] = JSON.stringify(value);
            }
          }
          if (value === void 0 || value === null) {
            delete _params[key];
          }
        }
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded"
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const body = new URLSearchParams(_params);
        if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
          console.log(`Slack API request (${name}): ${body}`);
        }
        if (retryHandlerState) {
          retryHandlerState.currentAttempt += 1;
        }
        const state = retryHandlerState ?? {
          currentAttempt: 0,
          logLevel: __classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f")
        };
        const request = new Request(url, {
          method: "POST",
          headers,
          body
        });
        let response;
        try {
          response = await fetch(request);
          for (const rh of this.retryHandlers) {
            if (await rh.shouldRetry({ state, request, response })) {
              if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
                console.log(`Retrying ${name} API call (params: ${JSON.stringify(params)})`);
              }
              return await this.call(name, params, state);
            }
          }
        } catch (e) {
          const error = new errors_1.SlackAPIConnectionError(name, -1, "", void 0, e);
          for (const rh of this.retryHandlers) {
            if (await rh.shouldRetry({ state, request, error })) {
              if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
                console.log(`Retrying ${name} API call (params: ${JSON.stringify(params)})`);
              }
              return await this.call(name, params, state);
            }
          }
          throw error;
        }
        if (response.status != 200) {
          const body2 = await response.text();
          throw new errors_1.SlackAPIConnectionError(name, response.status, body2, response.headers, void 0);
        }
        const responseBody = await response.json();
        const result = {
          ...responseBody,
          headers: response.headers
        };
        if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
          console.log(`Slack API response (${name}): ${JSON.stringify(result)}}`);
        }
        if (__classPrivateFieldGet(this, _SlackAPIClient_throwSlackAPIError, "f") && result.error) {
          throw new errors_1.SlackAPIError(name, result.error, result);
        }
        return result;
      }
    };
    __name(SlackAPIClient, "SlackAPIClient");
    exports.SlackAPIClient = SlackAPIClient;
    _a = SlackAPIClient, _SlackAPIClient_token = /* @__PURE__ */ new WeakMap(), _SlackAPIClient_options = /* @__PURE__ */ new WeakMap(), _SlackAPIClient_logLevel = /* @__PURE__ */ new WeakMap(), _SlackAPIClient_throwSlackAPIError = /* @__PURE__ */ new WeakMap(), _SlackAPIClient_baseUrl = /* @__PURE__ */ new WeakMap(), _SlackAPIClient_instances = /* @__PURE__ */ new WeakSet(), _SlackAPIClient_sendMultipartData = /* @__PURE__ */ __name(async function _SlackAPIClient_sendMultipartData2(name, params = {}, retryHandlerState = void 0) {
      const url = `${__classPrivateFieldGet(this, _SlackAPIClient_baseUrl, "f")}${name}`;
      const token = params ? params.token ?? __classPrivateFieldGet(this, _SlackAPIClient_token, "f") : __classPrivateFieldGet(this, _SlackAPIClient_token, "f");
      const body = new FormData();
      for (const [key, value] of Object.entries(params)) {
        if (value === void 0 || value === null || key === "token") {
          continue;
        }
        if (typeof value === "object") {
          if (value instanceof Blob) {
            body.append(key, value);
          } else {
            body.append(key, new Blob([value]));
          }
        } else {
          body.append(key, value);
        }
      }
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
        const bodyParamNames = Array.from(body.keys()).join(", ");
        console.log(`Slack API request (${name}): Sending ${bodyParamNames}`);
      }
      if (retryHandlerState) {
        retryHandlerState.currentAttempt += 1;
      }
      const state = retryHandlerState ?? {
        currentAttempt: 0,
        logLevel: __classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f")
      };
      const request = new Request(url, {
        method: "POST",
        headers,
        body
      });
      let response;
      try {
        response = await fetch(request);
        for (const rh of this.retryHandlers) {
          if (await rh.shouldRetry({ state, request, response })) {
            if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
              console.log(`Retrying ${name} API call`);
            }
            return await __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_sendMultipartData2).call(this, name, params, state);
          }
        }
      } catch (e) {
        const error = new errors_1.SlackAPIConnectionError(name, -1, "", void 0, e);
        for (const rh of this.retryHandlers) {
          if (await rh.shouldRetry({ state, request, error })) {
            if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
              console.log(`Retrying ${name} API call`);
            }
            return await __classPrivateFieldGet(this, _SlackAPIClient_instances, "m", _SlackAPIClient_sendMultipartData2).call(this, name, params, state);
          }
        }
        throw error;
      }
      if (response.status != 200) {
        const body2 = await response.text();
        throw new errors_1.SlackAPIConnectionError(name, response.status, body2, response.headers, void 0);
      }
      const responseBody = await response.json();
      const result = {
        ...responseBody,
        headers: response.headers
      };
      if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(this, _SlackAPIClient_logLevel, "f"))) {
        console.log(`Slack API response (${name}): ${JSON.stringify(result)}}`);
      }
      if (__classPrivateFieldGet(this, _SlackAPIClient_throwSlackAPIError, "f") && result.error) {
        throw new errors_1.SlackAPIError(name, result.error, result);
      }
      return result;
    }, "_SlackAPIClient_sendMultipartData"), _SlackAPIClient_uploadFilesV2 = /* @__PURE__ */ __name(async function _SlackAPIClient_uploadFilesV22(params) {
      const files = "files" in params ? params.files : [{ ...params }];
      const completes = [];
      const uploadErrors = [];
      const client = new _a(params.token ?? __classPrivateFieldGet(this, _SlackAPIClient_token, "f"), {
        logLevel: __classPrivateFieldGet(this, _SlackAPIClient_options, "f").logLevel,
        throwSlackAPIError: true
        // intentionally set to true for uploadAsync()
      });
      for (const f of files) {
        async function uploadAsync() {
          const body = f.file ? new Uint8Array(f.file instanceof Blob ? await f.file.arrayBuffer() : f.file) : new TextEncoder().encode(f.content);
          const getUrl = await client.files.getUploadURLExternal({
            token: params.token,
            filename: f.filename,
            length: body.length,
            snippet_type: f.snippet_type
          });
          const { upload_url, file_id } = getUrl;
          let response;
          try {
            response = await fetch(upload_url, { method: "POST", body });
          } catch (e) {
            throw new errors_1.SlackAPIConnectionError("files.slack.com", -1, "", void 0, e);
          }
          const uploadBody = await response.text();
          if ((0, index_1.isDebugLogEnabled)(__classPrivateFieldGet(client, _SlackAPIClient_logLevel, "f"))) {
            console.log(`Slack file upload result: (file ID: ${file_id}, status: ${response.status}, body: ${uploadBody})`);
          }
          if (response.status !== 200) {
            uploadErrors.push(uploadBody);
          }
          if (uploadErrors.length > 0) {
            const errorResponse = {
              ok: false,
              error: "upload_failure",
              uploadErrors,
              headers: response.headers
            };
            throw new errors_1.SlackAPIError("files.slack.com", "upload_error", errorResponse);
          }
          return { id: file_id, title: f.title ?? f.filename };
        }
        __name(uploadAsync, "uploadAsync");
        completes.push(uploadAsync());
      }
      try {
        const completion = await this.files.completeUploadExternal({
          token: params.token,
          files: await Promise.all(completes),
          channel_id: params.channel_id,
          initial_comment: params.initial_comment,
          thread_ts: params.thread_ts
        });
        return {
          ok: true,
          files: completion.files,
          headers: completion.headers
        };
      } catch (e) {
        if (e instanceof errors_1.SlackAPIError && !__classPrivateFieldGet(this, _SlackAPIClient_throwSlackAPIError, "f")) {
          return e.result;
        }
        throw e;
      }
    }, "_SlackAPIClient_uploadFilesV2"), _SlackAPIClient_bindApiCall = /* @__PURE__ */ __name(function _SlackAPIClient_bindApiCall2(self, method) {
      return self.call.bind(self, method);
    }, "_SlackAPIClient_bindApiCall"), _SlackAPIClient_bindNoArgAllowedApiCall = /* @__PURE__ */ __name(function _SlackAPIClient_bindNoArgAllowedApiCall2(self, method) {
      return self.call.bind(self, method);
    }, "_SlackAPIClient_bindNoArgAllowedApiCall"), _SlackAPIClient_bindMultipartApiCall = /* @__PURE__ */ __name(function _SlackAPIClient_bindMultipartApiCall2(self, method) {
      return __classPrivateFieldGet(self, _SlackAPIClient_instances, "m", _SlackAPIClient_sendMultipartData).bind(self, method);
    }, "_SlackAPIClient_bindMultipartApiCall"), _SlackAPIClient_bindFilesUploadV2 = /* @__PURE__ */ __name(function _SlackAPIClient_bindFilesUploadV22(self) {
      return __classPrivateFieldGet(self, _SlackAPIClient_instances, "m", _SlackAPIClient_uploadFilesV2).bind(self);
    }, "_SlackAPIClient_bindFilesUploadV2");
  }
});

// node_modules/slack-web-api-client/dist/client/request.js
var require_request = __commonJS({
  "node_modules/slack-web-api-client/dist/client/request.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/client/response.js
var require_response2 = __commonJS({
  "node_modules/slack-web-api-client/dist/client/response.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/client/automation-response/index.js
var require_automation_response = __commonJS({
  "node_modules/slack-web-api-client/dist/client/automation-response/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/client/generated-response/index.js
var require_generated_response = __commonJS({
  "node_modules/slack-web-api-client/dist/client/generated-response/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/client/webhook-client.js
var require_webhook_client = __commonJS({
  "node_modules/slack-web-api-client/dist/client/webhook-client.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _WebhookSender_url;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResponseUrlSender = exports.WebhookSender = void 0;
    var errors_1 = require_errors();
    var WebhookSender = class {
      constructor(url) {
        _WebhookSender_url.set(this, void 0);
        __classPrivateFieldSet(this, _WebhookSender_url, url, "f");
      }
      async call(params) {
        try {
          const response = await fetch(__classPrivateFieldGet(this, _WebhookSender_url, "f"), {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(params)
          });
          const responseBody = await response.text();
          const body = responseBody.toLowerCase();
          if (response.status != 200 || body !== "ok" && body.toLowerCase() !== '{"ok":true}') {
            throw new errors_1.WebhookError(response.status, responseBody);
          }
          return response;
        } catch (e) {
          throw new errors_1.WebhookError(-1, "", e);
        }
      }
    };
    __name(WebhookSender, "WebhookSender");
    exports.WebhookSender = WebhookSender;
    _WebhookSender_url = /* @__PURE__ */ new WeakMap();
    exports.ResponseUrlSender = WebhookSender;
  }
});

// node_modules/slack-web-api-client/dist/manifest/manifest-params.js
var require_manifest_params = __commonJS({
  "node_modules/slack-web-api-client/dist/manifest/manifest-params.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/manifest/events.js
var require_events = __commonJS({
  "node_modules/slack-web-api-client/dist/manifest/events.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/manifest/scopes.js
var require_scopes = __commonJS({
  "node_modules/slack-web-api-client/dist/manifest/scopes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/token-rotation/token-refresh-targets.js
var require_token_refresh_targets = __commonJS({
  "node_modules/slack-web-api-client/dist/token-rotation/token-refresh-targets.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/token-rotation/token-refresh-results.js
var require_token_refresh_results = __commonJS({
  "node_modules/slack-web-api-client/dist/token-rotation/token-refresh-results.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/token-rotation/token-rotator-options.js
var require_token_rotator_options = __commonJS({
  "node_modules/slack-web-api-client/dist/token-rotation/token-rotator-options.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-web-api-client/dist/token-rotation/token-rotator.js
var require_token_rotator = __commonJS({
  "node_modules/slack-web-api-client/dist/token-rotation/token-rotator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _TokenRotator_clientId;
    var _TokenRotator_clientSecret;
    var _TokenRotator_client;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TokenRotator = void 0;
    var errors_1 = require_errors();
    var api_client_1 = require_api_client();
    var TokenRotator = class {
      constructor(options) {
        _TokenRotator_clientId.set(this, void 0);
        _TokenRotator_clientSecret.set(this, void 0);
        _TokenRotator_client.set(this, void 0);
        __classPrivateFieldSet(this, _TokenRotator_clientId, options.clientId, "f");
        __classPrivateFieldSet(this, _TokenRotator_clientSecret, options.clientSecret, "f");
        __classPrivateFieldSet(this, _TokenRotator_client, new api_client_1.SlackAPIClient(void 0, options), "f");
      }
      async performRotation(targets) {
        const refreshResults = {};
        const randomSeconds = Math.round(crypto.getRandomValues(new Uint16Array(1))[0] / 100);
        const expireAt = (/* @__PURE__ */ new Date()).getTime() / 1e3 + randomSeconds;
        if (targets.bot && targets.bot.token_expires_at < expireAt) {
          try {
            const response = await __classPrivateFieldGet(this, _TokenRotator_client, "f").oauth.v2.access({
              client_id: __classPrivateFieldGet(this, _TokenRotator_clientId, "f"),
              client_secret: __classPrivateFieldGet(this, _TokenRotator_clientSecret, "f"),
              grant_type: "refresh_token",
              refresh_token: targets.bot.refresh_token
            });
            if (response && response.access_token && response.refresh_token && response.expires_in) {
              refreshResults.bot = {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                token_expires_at: (/* @__PURE__ */ new Date()).getTime() / 1e3 + response.expires_in
              };
            }
          } catch (e) {
            throw new errors_1.TokenRotationError(`Failed to refresh a bot token: ${e}`, e);
          }
        }
        if (targets.user && targets.user.token_expires_at < expireAt) {
          try {
            const response = await __classPrivateFieldGet(this, _TokenRotator_client, "f").oauth.v2.access({
              client_id: __classPrivateFieldGet(this, _TokenRotator_clientId, "f"),
              client_secret: __classPrivateFieldGet(this, _TokenRotator_clientSecret, "f"),
              grant_type: "refresh_token",
              refresh_token: targets.user.refresh_token
            });
            if (response && response.access_token && response.refresh_token && response.expires_in) {
              refreshResults.user = {
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                token_expires_at: (/* @__PURE__ */ new Date()).getTime() / 1e3 + response.expires_in
              };
            }
          } catch (e) {
            throw new errors_1.TokenRotationError(`Failed to refresh a user token: ${e}`, e);
          }
        }
        return refreshResults;
      }
    };
    __name(TokenRotator, "TokenRotator");
    exports.TokenRotator = TokenRotator;
    _TokenRotator_clientId = /* @__PURE__ */ new WeakMap(), _TokenRotator_clientSecret = /* @__PURE__ */ new WeakMap(), _TokenRotator_client = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/slack-web-api-client/dist/index.js
var require_dist = __commonJS({
  "node_modules/slack-web-api-client/dist/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_block_elements(), exports);
    __exportStar(require_blocks(), exports);
    __exportStar(require_confirm(), exports);
    __exportStar(require_link_unfurls(), exports);
    __exportStar(require_message_attachment(), exports);
    __exportStar(require_message_metadata(), exports);
    __exportStar(require_options(), exports);
    __exportStar(require_text_fields(), exports);
    __exportStar(require_rich_text_block(), exports);
    __exportStar(require_views(), exports);
    __exportStar(require_api_client_options(), exports);
    __exportStar(require_api_client(), exports);
    __exportStar(require_request(), exports);
    __exportStar(require_response2(), exports);
    __exportStar(require_retry_handler2(), exports);
    __exportStar(require_automation_response(), exports);
    __exportStar(require_generated_response(), exports);
    __exportStar(require_webhook_client(), exports);
    __exportStar(require_errors(), exports);
    __exportStar(require_logging(), exports);
    __exportStar(require_manifest_params(), exports);
    __exportStar(require_events(), exports);
    __exportStar(require_scopes(), exports);
    __exportStar(require_token_refresh_targets(), exports);
    __exportStar(require_token_refresh_results(), exports);
    __exportStar(require_token_rotator_options(), exports);
    __exportStar(require_token_rotator(), exports);
  }
});

// node_modules/slack-edge/dist/request/payload-types.js
var require_payload_types = __commonJS({
  "node_modules/slack-edge/dist/request/payload-types.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PayloadType = void 0;
    var PayloadType;
    (function(PayloadType2) {
      PayloadType2["BlockAction"] = "block_actions";
      PayloadType2["BlockSuggestion"] = "block_suggestion";
      PayloadType2["MessageShortcut"] = "message_action";
      PayloadType2["GlobalShortcut"] = "shortcut";
      PayloadType2["EventsAPI"] = "event_callback";
      PayloadType2["ViewSubmission"] = "view_submission";
      PayloadType2["ViewClosed"] = "view_closed";
    })(PayloadType || (exports.PayloadType = PayloadType = {}));
  }
});

// node_modules/slack-edge/dist/context/context.js
var require_context = __commonJS({
  "node_modules/slack-edge/dist/context/context.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.builtBaseContext = builtBaseContext;
    exports.extractIsEnterpriseInstall = extractIsEnterpriseInstall;
    exports.extractEnterpriseId = extractEnterpriseId;
    exports.extractTeamId = extractTeamId;
    exports.extractUserId = extractUserId;
    exports.extractActorEnterpriseId = extractActorEnterpriseId;
    exports.extractActorTeamId = extractActorTeamId;
    exports.extractActorUserId = extractActorUserId;
    exports.extractResponseUrl = extractResponseUrl;
    exports.extractChannelId = extractChannelId;
    exports.isAssitantThreadEvent = isAssitantThreadEvent;
    exports.extractThreadTs = extractThreadTs;
    exports.extractTriggerId = extractTriggerId;
    exports.extractFunctionExecutionId = extractFunctionExecutionId;
    exports.extractFunctionBotAccessToken = extractFunctionBotAccessToken;
    var payload_types_1 = require_payload_types();
    function builtBaseContext(body) {
      return {
        isEnterpriseInstall: extractIsEnterpriseInstall(body),
        enterpriseId: extractEnterpriseId(body),
        teamId: extractTeamId(body),
        userId: extractUserId(body),
        actorEnterpriseId: extractActorEnterpriseId(body),
        actorTeamId: extractActorTeamId(body),
        actorUserId: extractActorUserId(body),
        botId: void 0,
        // will be set later
        botUserId: void 0,
        // will be set later
        responseUrl: extractResponseUrl(body),
        channelId: extractChannelId(body),
        threadTs: extractThreadTs(body),
        isAssistantThreadEvent: isAssitantThreadEvent(body),
        triggerId: extractTriggerId(body),
        functionExecutionId: extractFunctionExecutionId(body),
        functionBotAccessToken: extractFunctionBotAccessToken(body),
        custom: {}
      };
    }
    __name(builtBaseContext, "builtBaseContext");
    function extractIsEnterpriseInstall(body) {
      if (body.authorizations && body.authorizations.length > 0) {
        return body.authorizations[0].is_enterprise_install;
      } else if (body.is_enterprise_install) {
        if (typeof body.is_enterprise_install === "string") {
          return body.is_enterprise_install === "true";
        }
        return body.is_enterprise_install == true;
      }
      return void 0;
    }
    __name(extractIsEnterpriseInstall, "extractIsEnterpriseInstall");
    function extractEnterpriseId(body) {
      if (body.enterprise) {
        if (typeof body.enterprise === "string") {
          return body.enterprise;
        } else if (typeof body.enterprise === "object" && body.enterprise.id) {
          return body.enterprise.id;
        }
      } else if (body.authorizations && body.authorizations.length > 0) {
        return extractEnterpriseId(body.authorizations[0]);
      } else if (body.enterprise_id) {
        return body.enterprise_id;
      } else if (body.team && typeof body.team === "object" && body.team.enterprise_id) {
        return body.team.enterprise_id;
      } else if (body.event) {
        return extractEnterpriseId(body.event);
      }
      return void 0;
    }
    __name(extractEnterpriseId, "extractEnterpriseId");
    function extractTeamId(body) {
      if (body.view && body.view.app_installed_team_id) {
        return body.view.app_installed_team_id;
      } else if (body.team) {
        if (typeof body.team === "string") {
          return body.team;
        } else if (body.team.id) {
          return body.team.id;
        }
      } else if (body.authorizations && body.authorizations.length > 0) {
        return extractTeamId(body.authorizations[0]);
      } else if (body.team_id) {
        return body.team_id;
      } else if (body.user && typeof body.user === "object") {
        return body.user.team_id;
      } else if (body.view && typeof body.view === "object") {
        return body.view.team_id;
      }
      return void 0;
    }
    __name(extractTeamId, "extractTeamId");
    function extractUserId(body) {
      if (body.user) {
        if (typeof body.user === "string") {
          return body.user;
        }
        if (typeof body.user === "object" && body.user.id) {
          return body.user.id;
        }
      } else if (body.user_id) {
        return body.user_id;
      } else if (body.event) {
        return extractUserId(body.event);
      } else if (body.message) {
        return extractUserId(body.message);
      } else if (body.previous_message) {
        return extractUserId(body.previous_message);
      }
      return void 0;
    }
    __name(extractUserId, "extractUserId");
    function extractActorEnterpriseId(body) {
      if (body.is_ext_shared_channel) {
        if (body.type === "event_callback") {
          const eventTeamId = body.event?.user_team || body.event?.team;
          if (eventTeamId && eventTeamId.startsWith("E")) {
            return eventTeamId;
          } else if (eventTeamId === body.team_id) {
            return body.enterprise_id;
          }
        }
      }
      return extractEnterpriseId(body);
    }
    __name(extractActorEnterpriseId, "extractActorEnterpriseId");
    function extractActorTeamId(body) {
      if (body.is_ext_shared_channel) {
        if (body.type === "event_callback") {
          const eventType = body.event.type;
          if (eventType === "app_mention") {
            const userTeam = body.event.user_team;
            if (!userTeam) {
              return body.event.team;
            } else if (userTeam.startsWith("T")) {
              return userTeam;
            }
            return void 0;
          }
          const eventUserTeam = body.event.user_team;
          if (eventUserTeam) {
            if (eventUserTeam.startsWith("T")) {
              return eventUserTeam;
            } else if (eventUserTeam.startsWith("E")) {
              if (eventUserTeam === body.enterprise_id) {
                return body.team_id;
              } else if (eventUserTeam === body.context_enterprise_id) {
                return body.context_team_id;
              }
            }
          }
          const eventTeam = body.event.team;
          if (eventTeam) {
            if (eventTeam.startsWith("T")) {
              return eventTeam;
            } else if (eventTeam.startsWith("E")) {
              if (eventTeam === body.enterprise_id) {
                return body.team_id;
              } else if (eventTeam === body.context_enterprise_id) {
                return body.context_team_id;
              }
            }
          }
        }
      }
      return extractTeamId(body);
    }
    __name(extractActorTeamId, "extractActorTeamId");
    function extractActorUserId(body) {
      if (body.is_ext_shared_channel) {
        if (body.type === "event_callback") {
          if (body.event) {
            if (extractActorEnterpriseId(body) && extractActorTeamId(body)) {
              return void 0;
            }
            return body.event.user || body.event.user_id;
          } else {
            return void 0;
          }
        }
      }
      return extractUserId(body);
    }
    __name(extractActorUserId, "extractActorUserId");
    function extractResponseUrl(body) {
      if (body.response_url) {
        return body.response_url;
      } else if (body.response_urls && body.response_urls.length > 0) {
        return body.response_urls[0].response_url;
      }
      return void 0;
    }
    __name(extractResponseUrl, "extractResponseUrl");
    function extractChannelId(body) {
      if (body.channel) {
        if (typeof body.channel === "string") {
          return body.channel;
        } else if (typeof body.channel === "object" && body.channel.id) {
          return body.channel.id;
        }
      } else if (body.channel_id) {
        return body.channel_id;
      } else if (body.event) {
        return extractChannelId(body.event);
      } else if (body.item) {
        return extractChannelId(body.item);
      } else if (body.assistant_thread) {
        return extractChannelId(body.assistant_thread);
      }
      return void 0;
    }
    __name(extractChannelId, "extractChannelId");
    function isAssitantThreadEvent(body) {
      return body.type === payload_types_1.PayloadType.EventsAPI && body.event !== void 0 && (body.event.type === "assistant_thread_started" || body.event.type === "assistant_thread_context_changed" || body.event.type === "message" && body.event.channel_type === "im");
    }
    __name(isAssitantThreadEvent, "isAssitantThreadEvent");
    function extractThreadTs(body) {
      if (isAssitantThreadEvent(body)) {
        if (body.event.assistant_thread !== void 0 && body.event.assistant_thread.thread_ts !== void 0) {
          return body.event.assistant_thread.thread_ts;
        } else if (body.event.channel !== void 0) {
          if (body.event.thread_ts !== void 0) {
            return body.event.thread_ts;
          } else if (body.event.message !== void 0 && body.event.message.thread_ts !== void 0) {
            return body.event.message.thread_ts;
          } else if (body.event.previous_message !== void 0 && body.event.previous_message.thread_ts !== void 0) {
            return body.event.previous_message.thread_ts;
          }
        }
      }
      return void 0;
    }
    __name(extractThreadTs, "extractThreadTs");
    function extractTriggerId(body) {
      if (body.trigger_id) {
        return body.trigger_id;
      }
      if (body.interactivity) {
        return body.interactivity.interactivity_pointer;
      }
      return void 0;
    }
    __name(extractTriggerId, "extractTriggerId");
    function extractFunctionExecutionId(body) {
      if (body.event) {
        return extractFunctionExecutionId(body.event);
      }
      if (body.function_execution_id) {
        return body.function_execution_id;
      }
      if (body.function_data) {
        return body.function_data.execution_id;
      }
      return void 0;
    }
    __name(extractFunctionExecutionId, "extractFunctionExecutionId");
    function extractFunctionBotAccessToken(body) {
      if (body.event) {
        return extractFunctionBotAccessToken(body.event);
      }
      if (body.bot_access_token) {
        return body.bot_access_token;
      }
      return void 0;
    }
    __name(extractFunctionBotAccessToken, "extractFunctionBotAccessToken");
  }
});

// node_modules/slack-edge/dist/middleware/built-in-middleware.js
var require_built_in_middleware = __commonJS({
  "node_modules/slack-edge/dist/middleware/built-in-middleware.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.urlVerification = void 0;
    exports.ignoringSelfEvents = ignoringSelfEvents;
    var urlVerification = /* @__PURE__ */ __name(async (req) => {
      if (req.body.type === "url_verification") {
        return { status: 200, body: req.body.challenge };
      }
    }, "urlVerification");
    exports.urlVerification = urlVerification;
    var eventTypesToKeep = ["member_joined_channel", "member_left_channel"];
    function ignoringSelfEvents(ignoreSelfAssistantMessageEvents) {
      return async (req) => {
        if (req.body.event) {
          if (eventTypesToKeep.includes(req.body.event.type)) {
            return;
          }
          const auth = req.context.authorizeResult;
          const isSelfEvent = auth.botId === req.body.event.bot_id || auth.botUserId === req.context.userId;
          if (isSelfEvent) {
            if (!ignoreSelfAssistantMessageEvents && req.body.event.type === "message" && req.body.event.channel_type === "im") {
              return;
            }
            return { status: 200, body: "" };
          }
        }
      };
    }
    __name(ignoringSelfEvents, "ignoringSelfEvents");
  }
});

// node_modules/slack-edge/dist/errors.js
var require_errors2 = __commonJS({
  "node_modules/slack-edge/dist/errors.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SocketModeError = exports.AuthorizeError = exports.ConfigError = void 0;
    var ConfigError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "ConfigError";
      }
    };
    __name(ConfigError, "ConfigError");
    exports.ConfigError = ConfigError;
    var AuthorizeError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "AuthorizeError";
      }
    };
    __name(AuthorizeError, "AuthorizeError");
    exports.AuthorizeError = AuthorizeError;
    var SocketModeError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "SocketModeError";
      }
    };
    __name(SocketModeError, "SocketModeError");
    exports.SocketModeError = SocketModeError;
  }
});

// node_modules/slack-edge/dist/authorization/single-team-authorize.js
var require_single_team_authorize = __commonJS({
  "node_modules/slack-edge/dist/authorization/single-team-authorize.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.singleTeamAuthorize = void 0;
    var errors_1 = require_errors2();
    var slack_web_api_client_1 = require_dist();
    var singleTeamAuthorize = /* @__PURE__ */ __name(async (req) => {
      const botToken = req.env.SLACK_BOT_TOKEN;
      const client = new slack_web_api_client_1.SlackAPIClient(botToken);
      try {
        const response = await client.auth.test();
        const scopes = response.headers.get("x-oauth-scopes") ?? "";
        return {
          botToken,
          enterpriseId: response.enterprise_id,
          teamId: response.team_id,
          team: response.team,
          url: response.url,
          botId: response.bot_id,
          botUserId: response.user_id,
          userId: response.user_id,
          user: response.user,
          botScopes: scopes.split(","),
          userToken: void 0,
          // As mentioned above, user tokens are not supported in this module
          userScopes: void 0
          // As mentioned above, user tokens are not supported in this module
        };
      } catch (e) {
        throw new errors_1.AuthorizeError(`Failed to call auth.test API due to ${e.message}`);
      }
    }, "singleTeamAuthorize");
    exports.singleTeamAuthorize = singleTeamAuthorize;
  }
});

// node_modules/slack-edge/dist/execution-context.js
var require_execution_context = __commonJS({
  "node_modules/slack-edge/dist/execution-context.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopExecutionContext = void 0;
    var NoopExecutionContext = class {
      // deno-lint-ignore no-explicit-any
      waitUntil(promise) {
        promise.catch((reason) => {
          console.error(`Failed to run a lazy listener: ${reason}`);
        });
      }
    };
    __name(NoopExecutionContext, "NoopExecutionContext");
    exports.NoopExecutionContext = NoopExecutionContext;
  }
});

// node_modules/slack-edge/dist/utility/message-events.js
var require_message_events = __commonJS({
  "node_modules/slack-edge/dist/utility/message-events.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isPostedMessageEvent = void 0;
    var isPostedMessageEvent = /* @__PURE__ */ __name((event) => {
      return event.subtype === void 0 || event.subtype === "bot_message" || event.subtype === "file_share" || event.subtype === "thread_broadcast";
    }, "isPostedMessageEvent");
    exports.isPostedMessageEvent = isPostedMessageEvent;
  }
});

// node_modules/slack-edge/dist/socket-mode/payload-handler.js
var require_payload_handler = __commonJS({
  "node_modules/slack-edge/dist/socket-mode/payload-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromSocketModeToRequest = fromSocketModeToRequest;
    exports.fromResponseToSocketModePayload = fromResponseToSocketModePayload;
    function fromSocketModeToRequest({ url, body, retryNum, retryReason }) {
      if (!body) {
        return void 0;
      }
      const payload = JSON.stringify(body);
      const headers = {
        "content-type": "application/json"
      };
      if (retryNum) {
        headers["x-slack-retry-num"] = retryNum;
      }
      if (retryReason) {
        headers["x-slack-retry-reason"] = retryReason;
      }
      const options = {
        method: "POST",
        headers: new Headers(headers),
        body: new Blob([payload]).stream(),
        duplex: "half"
        // required when running on Node.js runtime
      };
      return new Request(url ?? "wss://localhost", options);
    }
    __name(fromSocketModeToRequest, "fromSocketModeToRequest");
    async function fromResponseToSocketModePayload({ response }) {
      let message = {};
      if (response.body) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.startsWith("text/plain")) {
          const text = await response.text();
          if (text) {
            message = { text };
          }
        } else {
          message = await response.json();
        }
      }
      return message;
    }
    __name(fromResponseToSocketModePayload, "fromResponseToSocketModePayload");
  }
});

// node_modules/slack-edge/dist/socket-mode/socket-mode-client.js
var require_socket_mode_client = __commonJS({
  "node_modules/slack-edge/dist/socket-mode/socket-mode-client.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SocketModeClient = void 0;
    var slack_web_api_client_1 = require_dist();
    var errors_1 = require_errors2();
    var payload_handler_1 = require_payload_handler();
    var SocketModeClient = class {
      constructor(app) {
        if (!app.socketMode) {
          throw new errors_1.ConfigError("socketMode: true must be set for running with Socket Mode");
        }
        if (!app.appLevelToken) {
          throw new errors_1.ConfigError("appLevelToken must be set for running with Socket Mode");
        }
        this.app = app;
        this.appLevelToken = app.appLevelToken;
        console.warn("WARNING: The Socket Mode support provided by slack-edge is still experimental and is not designed to handle reconnections for production-grade applications. It is recommended to use this mode only for local development and testing purposes.");
      }
      async connect() {
        const client = new slack_web_api_client_1.SlackAPIClient(this.appLevelToken);
        try {
          const newConnection = await client.apps.connections.open();
          this.ws = new WebSocket(newConnection.url);
        } catch (e) {
          throw new errors_1.SocketModeError(`Failed to establish a new WSS connection: ${e}`);
        }
        if (this.ws) {
          const ws = this.ws;
          ws.onopen = async (ev) => {
            if ((0, slack_web_api_client_1.isDebugLogEnabled)(app.env.SLACK_LOGGING_LEVEL)) {
              console.log(`Now the Socket Mode client is connected to Slack: ${JSON.stringify(ev)}`);
            }
          };
          ws.onclose = async (ev) => {
            if ((0, slack_web_api_client_1.isDebugLogEnabled)(app.env.SLACK_LOGGING_LEVEL)) {
              console.log(`The Socket Mode client is disconnected from Slack: ${JSON.stringify(ev)}`);
            }
          };
          ws.onerror = async (e) => {
            console.error(`An error was thrown by the Socket Mode connection: ${e}`);
          };
          const app = this.app;
          ws.onmessage = async (ev) => {
            try {
              if (ev.data && typeof ev.data === "string" && ev.data.startsWith("{")) {
                const data = JSON.parse(ev.data);
                if (data.type === "hello") {
                  if ((0, slack_web_api_client_1.isDebugLogEnabled)(app.env.SLACK_LOGGING_LEVEL)) {
                    console.log(`*** Received hello data ***
 ${ev.data}`);
                  }
                  return;
                }
                const request = (0, payload_handler_1.fromSocketModeToRequest)({
                  url: ws.url,
                  body: data.payload,
                  retryNum: data.retry_attempt,
                  retryReason: data.retry_reason
                });
                if (!request) {
                  return;
                }
                const response = await app.run(request);
                const message = {
                  envelope_id: data.envelope_id
                };
                const payload = await (0, payload_handler_1.fromResponseToSocketModePayload)({ response });
                if (payload) {
                  message.payload = payload;
                }
                ws.send(JSON.stringify(message));
              } else {
                if ((0, slack_web_api_client_1.isDebugLogEnabled)(app.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Received non-JSON data ***
 ${ev.data}`);
                }
              }
            } catch (e) {
              console.error(`Failed to handle a WebSocke message: ${e}`);
            }
          };
        }
      }
      // deno-lint-ignore require-await
      async disconnect() {
        if (this.ws) {
          this.ws.close();
          this.ws = void 0;
        }
      }
    };
    __name(SocketModeClient, "SocketModeClient");
    exports.SocketModeClient = SocketModeClient;
  }
});

// node_modules/slack-edge/dist/utility/function-executed-event.js
var require_function_executed_event = __commonJS({
  "node_modules/slack-edge/dist/utility/function-executed-event.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isFunctionExecutedEvent = void 0;
    var isFunctionExecutedEvent = /* @__PURE__ */ __name((event) => {
      return event.type === "function_executed";
    }, "isFunctionExecutedEvent");
    exports.isFunctionExecutedEvent = isFunctionExecutedEvent;
  }
});

// node_modules/slack-edge/dist/assistant/assistant.js
var require_assistant = __commonJS({
  "node_modules/slack-edge/dist/assistant/assistant.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Assistant = void 0;
    var context_1 = require_context();
    var Assistant = class {
      constructor(options = {}) {
        this.threadContextStore = options.threadContextStore;
        this.threadStartedHandler = async (req) => {
          try {
            if ((0, context_1.isAssitantThreadEvent)(req.body)) {
              const request = req;
              if (options.threadStarted) {
                await options.threadStarted(request);
              } else {
                const { say, setSuggestedPrompts } = request.context;
                await say({ text: ":wave: Hi, how can I help you today?" });
                await setSuggestedPrompts({ title: "New chat", prompts: ["What does SLACK stand for?"] });
              }
            }
          } catch (e) {
            console.error(`Failed to execute threadStartedHandler listener: ${e.stack}`);
          }
        };
        this.threadContextChangedHandler = async (req) => {
          try {
            if ((0, context_1.isAssitantThreadEvent)(req.body)) {
              const request = req;
              if (options.threadContextChanged) {
                await options.threadContextChanged(request);
              } else {
                const { context } = request;
                await context.saveThreadContextStore({ ...request.payload.assistant_thread.context });
              }
            }
          } catch (e) {
            console.error(`Failed to execute threadContextChangedHandler listener: ${e.stack}`);
          }
        };
        this.userMessageHandler = async (req) => {
          try {
            if (req.payload.subtype === void 0 || req.payload.subtype === "file_share") {
              if (options.userMessage) {
                await options.userMessage(req);
              } else {
              }
            }
          } catch (e) {
            console.error(`Failed to execute userMessageHandler listener: ${e.stack}`);
          }
        };
        this.botMessageHandler = async (req) => {
          try {
            if (req.payload.subtype === void 0 && req.payload.user === req.context.botUserId) {
              if (options.botMessage) {
                await options.botMessage(req);
              } else {
              }
            }
          } catch (e) {
            console.error(`Failed to execute botMessageHandler listener: ${e.stack}`);
          }
        };
      }
      threadStarted(handler) {
        this.threadStartedHandler = async (req) => {
          try {
            if ((0, context_1.isAssitantThreadEvent)(req.body)) {
              await handler(req);
            }
          } catch (e) {
            console.error(`Failed to execute threadStartedHandler listener: ${e.stack}`);
          }
        };
      }
      threadContextChanged(handler) {
        this.threadContextChangedHandler = async (req) => {
          try {
            if ((0, context_1.isAssitantThreadEvent)(req.body)) {
              await handler(req);
            }
          } catch (e) {
            console.error(`Failed to execute threadContextChangedHandler listener: ${e.stack}`);
          }
        };
      }
      userMessage(handler) {
        this.userMessageHandler = async (req) => {
          try {
            if (req.payload.subtype === void 0 || req.payload.subtype === "file_share") {
              await handler(req);
            }
          } catch (e) {
            console.error(`Failed to execute userMessageHandler listener: ${e.stack}`);
          }
        };
      }
      botMessage(handler) {
        this.botMessageHandler = async (req) => {
          try {
            if (req.payload.subtype === void 0 && req.payload.user === req.context.botUserId) {
              await handler(req);
            }
          } catch (e) {
            console.error(`Failed to execute botMessageHandler listener: ${e.stack}`);
          }
        };
      }
    };
    __name(Assistant, "Assistant");
    exports.Assistant = Assistant;
  }
});

// node_modules/slack-edge/dist/assistant/thread-context-store.js
var require_thread_context_store = __commonJS({
  "node_modules/slack-edge/dist/assistant/thread-context-store.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _DefaultAssistantThreadContextStore_instances;
    var _DefaultAssistantThreadContextStore_client;
    var _DefaultAssistantThreadContextStore_thisBotUserId;
    var _DefaultAssistantThreadContextStore_findFirstAssistantReply;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultAssistantThreadContextStore = void 0;
    var DefaultAssistantThreadContextStore = class {
      constructor({ client, thisBotUserId }) {
        _DefaultAssistantThreadContextStore_instances.add(this);
        _DefaultAssistantThreadContextStore_client.set(this, void 0);
        _DefaultAssistantThreadContextStore_thisBotUserId.set(this, void 0);
        __classPrivateFieldSet(this, _DefaultAssistantThreadContextStore_client, client, "f");
        __classPrivateFieldSet(this, _DefaultAssistantThreadContextStore_thisBotUserId, thisBotUserId, "f");
      }
      async save(key, newContext) {
        const reply = await __classPrivateFieldGet(this, _DefaultAssistantThreadContextStore_instances, "m", _DefaultAssistantThreadContextStore_findFirstAssistantReply).call(this, key);
        if (reply) {
          await __classPrivateFieldGet(this, _DefaultAssistantThreadContextStore_client, "f").chat.update({
            ...reply,
            channel: reply.channel_id,
            metadata: {
              // this must be placed at the bottom
              event_type: "assistant_thread_context",
              event_payload: { ...newContext }
            }
          });
        }
      }
      async find(key) {
        const reply = await __classPrivateFieldGet(this, _DefaultAssistantThreadContextStore_instances, "m", _DefaultAssistantThreadContextStore_findFirstAssistantReply).call(this, key);
        if (reply) {
          return reply.metadata?.event_payload;
        }
        return void 0;
      }
    };
    __name(DefaultAssistantThreadContextStore, "DefaultAssistantThreadContextStore");
    exports.DefaultAssistantThreadContextStore = DefaultAssistantThreadContextStore;
    _DefaultAssistantThreadContextStore_client = /* @__PURE__ */ new WeakMap(), _DefaultAssistantThreadContextStore_thisBotUserId = /* @__PURE__ */ new WeakMap(), _DefaultAssistantThreadContextStore_instances = /* @__PURE__ */ new WeakSet(), _DefaultAssistantThreadContextStore_findFirstAssistantReply = /* @__PURE__ */ __name(async function _DefaultAssistantThreadContextStore_findFirstAssistantReply2(key) {
      try {
        const response = await __classPrivateFieldGet(this, _DefaultAssistantThreadContextStore_client, "f").conversations.replies({
          channel: key.channel_id,
          ts: key.thread_ts,
          oldest: key.thread_ts,
          include_all_metadata: true,
          limit: 4
        });
        if (response.messages) {
          for (const message of response.messages) {
            if (!("subtype" in message) && message.user === __classPrivateFieldGet(this, _DefaultAssistantThreadContextStore_thisBotUserId, "f")) {
              return {
                channel_id: key.channel_id,
                ts: message.ts,
                text: message.text,
                blocks: message.blocks,
                metadata: message.metadata
              };
            }
          }
        }
      } catch (e) {
        console.log(`Failed to fetch conversations.replies API result: ${e}`);
      }
      return void 0;
    }, "_DefaultAssistantThreadContextStore_findFirstAssistantReply");
  }
});

// node_modules/slack-edge/dist/authorization/authorize-error-handler.js
var require_authorize_error_handler = __commonJS({
  "node_modules/slack-edge/dist/authorization/authorize-error-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildDefaultAuthorizeErrorHanlder = buildDefaultAuthorizeErrorHanlder;
    function buildDefaultAuthorizeErrorHanlder() {
      return async ({ error }) => {
        return error;
      };
    }
    __name(buildDefaultAuthorizeErrorHanlder, "buildDefaultAuthorizeErrorHanlder");
  }
});

// node_modules/slack-edge/dist/app.js
var require_app = __commonJS({
  "node_modules/slack-edge/dist/app.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _SlackApp_instances;
    var _SlackApp_slashCommands;
    var _SlackApp_events;
    var _SlackApp_globalShorcuts;
    var _SlackApp_messageShorcuts;
    var _SlackApp_blockActions;
    var _SlackApp_blockSuggestions;
    var _SlackApp_viewSubmissions;
    var _SlackApp_viewClosed;
    var _SlackApp_assistantEvent;
    var _SlackApp_callAuthorize;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.noopLazyHandler = exports.SlackApp = void 0;
    var request_parser_1 = require_request_parser();
    var request_verification_1 = require_request_verification();
    var response_1 = require_response();
    var slack_web_api_client_1 = require_dist();
    var context_1 = require_context();
    var slack_web_api_client_2 = require_dist();
    var built_in_middleware_1 = require_built_in_middleware();
    var errors_1 = require_errors2();
    var single_team_authorize_1 = require_single_team_authorize();
    var execution_context_1 = require_execution_context();
    var payload_types_1 = require_payload_types();
    var message_events_1 = require_message_events();
    var socket_mode_client_1 = require_socket_mode_client();
    var function_executed_event_1 = require_function_executed_event();
    var assistant_1 = require_assistant();
    var thread_context_store_1 = require_thread_context_store();
    var authorize_error_handler_1 = require_authorize_error_handler();
    var SlackApp2 = class {
      // --------------------------
      constructor(options) {
        _SlackApp_instances.add(this);
        this.preAuthorizeMiddleware = [built_in_middleware_1.urlVerification];
        this.postAuthorizeMiddleware = [];
        this.eventsToSkipAuthorize = ["app_uninstalled", "tokens_revoked"];
        _SlackApp_slashCommands.set(this, []);
        _SlackApp_events.set(this, []);
        _SlackApp_globalShorcuts.set(this, []);
        _SlackApp_messageShorcuts.set(this, []);
        _SlackApp_blockActions.set(this, []);
        _SlackApp_blockSuggestions.set(this, []);
        _SlackApp_viewSubmissions.set(this, []);
        _SlackApp_viewClosed.set(this, []);
        if (options.env.SLACK_BOT_TOKEN === void 0 && (options.authorize === void 0 || options.authorize === single_team_authorize_1.singleTeamAuthorize)) {
          throw new errors_1.ConfigError("When you don't pass env.SLACK_BOT_TOKEN, your own authorize function, which supplies a valid token to use, needs to be passed instead.");
        }
        this.env = options.env;
        this.client = new slack_web_api_client_1.SlackAPIClient(options.env.SLACK_BOT_TOKEN, {
          logLevel: this.env.SLACK_LOGGING_LEVEL
        });
        this.appLevelToken = options.env.SLACK_APP_TOKEN;
        this.socketMode = options.socketMode ?? this.appLevelToken !== void 0;
        if (this.socketMode) {
          this.signingSecret = "";
        } else {
          if (!this.env.SLACK_SIGNING_SECRET) {
            throw new errors_1.ConfigError("env.SLACK_SIGNING_SECRET is required to run your app on edge functions!");
          }
          this.signingSecret = this.env.SLACK_SIGNING_SECRET;
        }
        this.startLazyListenerAfterAck = options.startLazyListenerAfterAck ?? false;
        this.ignoreSelfEvents = options.ignoreSelfEvents ?? true;
        if (this.ignoreSelfEvents) {
          const middleware = (0, built_in_middleware_1.ignoringSelfEvents)(options.ignoreSelfAssistantMessageEvents ?? true);
          this.postAuthorizeMiddleware.push(middleware);
        }
        this.authorize = options.authorize ?? single_team_authorize_1.singleTeamAuthorize;
        this.authorizeErrorHandler = options.authorizeErrorHandler ?? (0, authorize_error_handler_1.buildDefaultAuthorizeErrorHanlder)();
        this.routes = { events: options.routes?.events };
        this.assistantThreadContextStore = options.assistantThreadContextStore;
      }
      /**
       * Registers a pre-authorize middleware.
       * @param middleware middleware
       * @returns this instance
       */
      beforeAuthorize(middleware) {
        this.preAuthorizeMiddleware.push(middleware);
        return this;
      }
      /**
       * Registers a post-authorize middleware. This naming is for consistency with bolt-js.
       * @param middleware middleware
       * @returns this instance
       */
      middleware(middleware) {
        return this.afterAuthorize(middleware);
      }
      /**
       * Registers a post-authorize middleware. This naming is for consistency with bolt-js.
       * @param middleware middleware
       * @returns this instance
       */
      use(middleware) {
        return this.afterAuthorize(middleware);
      }
      /**
       * Registers a post-authorize middleware.
       * @param middleware middleware
       * @returns this instance
       */
      afterAuthorize(middleware) {
        this.postAuthorizeMiddleware.push(middleware);
        return this;
      }
      /**
       * Registers a listener that handles slash command executions.
       * @param pattern the pattern to match slash command name
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      command(pattern, ack, lazy = exports.noopLazyHandler) {
        const handler = { ack, lazy };
        __classPrivateFieldGet(this, _SlackApp_slashCommands, "f").push((body) => {
          if (body.type || !body.command) {
            return null;
          }
          if (typeof pattern === "string" && body.command === pattern) {
            return handler;
          } else if (typeof pattern === "object" && pattern instanceof RegExp && body.command.match(pattern)) {
            return handler;
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles custom function calls within Workflow Builder.
       * Please be aware that this feature is still in beta as of April 2024.
       * @param callbackId the pattern to match callback_id in a payload
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      function(callbackId, lazy) {
        __classPrivateFieldGet(this, _SlackApp_events, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.EventsAPI || !body.event || body.event.type !== "function_executed") {
            return null;
          }
          if ((0, function_executed_event_1.isFunctionExecutedEvent)(body.event)) {
            let matched = true;
            if (callbackId !== void 0) {
              if (typeof callbackId === "string") {
                matched = body.event.function.callback_id.includes(callbackId);
              }
              if (typeof callbackId === "object") {
                matched = body.event.function.callback_id.match(callbackId) !== null;
              }
            }
            if (matched) {
              return { ack: async (_) => "", lazy };
            }
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles Events API request.
       * @param event the pattern to match event type in a payload
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      event(event, lazy) {
        __classPrivateFieldGet(this, _SlackApp_events, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.EventsAPI || !body.event) {
            return null;
          }
          if (body.event.type === event) {
            return { ack: async () => "", lazy };
          }
          return null;
        });
        return this;
      }
      assistant(assistant) {
        __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "assistant_thread_started", assistant.threadStartedHandler);
        __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "assistant_thread_context_changed", assistant.threadContextChangedHandler);
        __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "message", assistant.userMessageHandler, false);
        __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "message", assistant.botMessageHandler, true);
        if (assistant.threadContextStore) {
          this.assistantThreadContextStore = assistant.threadContextStore;
        }
        return this;
      }
      assistantThreadStarted(lazy) {
        return __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "assistant_thread_started", new assistant_1.Assistant({
          threadContextStore: this.assistantThreadContextStore,
          threadStarted: lazy
        }).threadStartedHandler);
      }
      assistantThreadContextChanged(lazy) {
        return __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "assistant_thread_context_changed", new assistant_1.Assistant({
          threadContextStore: this.assistantThreadContextStore,
          threadContextChanged: lazy
        }).threadContextChangedHandler);
      }
      assistantUserMessage(lazy) {
        return __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "message", new assistant_1.Assistant({
          threadContextStore: this.assistantThreadContextStore,
          userMessage: lazy
        }).userMessageHandler, false);
      }
      assistantBotMessage(lazy) {
        return __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_assistantEvent).call(this, "message", new assistant_1.Assistant({
          threadContextStore: this.assistantThreadContextStore,
          botMessage: lazy
        }).botMessageHandler, true);
      }
      /**
       * Registers a listener that handles all newly posted message events.
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      anyMessage(lazy) {
        return this.message(void 0, lazy);
      }
      /**
       * Registers a listener that handles newly posted message events that matches the pattern.
       * @param pattern the pattern to match a message event's text
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      message(pattern, lazy) {
        __classPrivateFieldGet(this, _SlackApp_events, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.EventsAPI || !body.event || body.event.type !== "message") {
            return null;
          }
          if ((0, message_events_1.isPostedMessageEvent)(body.event)) {
            let matched = true;
            if (pattern !== void 0) {
              if (typeof pattern === "string") {
                matched = body.event.text.includes(pattern);
              }
              if (typeof pattern === "object") {
                matched = body.event.text.match(pattern) !== null;
              }
            }
            if (matched) {
              return { ack: async (_) => "", lazy };
            }
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles global/message shortcut executions.
       * @param callbackId the pattern to match callback_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      shortcut(callbackId, ack, lazy = exports.noopLazyHandler) {
        return this.globalShortcut(callbackId, ack, lazy).messageShortcut(callbackId, ack, lazy);
      }
      /**
       * Registers a listener that handles global shortcut executions.
       * @param callbackId the pattern to match callback_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      globalShortcut(callbackId, ack, lazy = exports.noopLazyHandler) {
        const handler = { ack, lazy };
        __classPrivateFieldGet(this, _SlackApp_globalShorcuts, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.GlobalShortcut || !body.callback_id) {
            return null;
          }
          if (typeof callbackId === "string" && body.callback_id === callbackId) {
            return handler;
          } else if (typeof callbackId === "object" && callbackId instanceof RegExp && body.callback_id.match(callbackId)) {
            return handler;
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles message shortcut executions.
       * @param callbackId the pattern to match callback_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      messageShortcut(callbackId, ack, lazy = exports.noopLazyHandler) {
        const handler = { ack, lazy };
        __classPrivateFieldGet(this, _SlackApp_messageShorcuts, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.MessageShortcut || !body.callback_id) {
            return null;
          }
          if (typeof callbackId === "string" && body.callback_id === callbackId) {
            return handler;
          } else if (typeof callbackId === "object" && callbackId instanceof RegExp && body.callback_id.match(callbackId)) {
            return handler;
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles type: "block_actions" requests.
       * @param constraints the constraints to match block_id/action_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      action(constraints, ack, lazy = exports.noopLazyHandler) {
        const handler = { ack, lazy };
        __classPrivateFieldGet(this, _SlackApp_blockActions, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.BlockAction || !body.actions || !body.actions[0]) {
            return null;
          }
          const action = body.actions[0];
          if (typeof constraints === "string" && action.action_id === constraints) {
            return handler;
          } else if (typeof constraints === "object") {
            if (constraints instanceof RegExp) {
              if (action.action_id.match(constraints)) {
                return handler;
              }
            } else if (constraints.type) {
              if (action.type === constraints.type) {
                if (action.action_id === constraints.action_id) {
                  if (constraints.block_id && action.block_id !== constraints.block_id) {
                    return null;
                  }
                  return handler;
                }
              }
            }
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles type: "block_suggestion" requests.
       * Note that your app must return the options/option_groups within 3 seconds,
       * so slack-edge intentionally does not accept lazy here.
       * @param constraints the constraints to match block_id/action_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @returns this instance
       */
      options(constraints, ack) {
        const handler = { ack };
        __classPrivateFieldGet(this, _SlackApp_blockSuggestions, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.BlockSuggestion || !body.action_id) {
            return null;
          }
          if (typeof constraints === "string" && body.action_id === constraints) {
            return handler;
          } else if (typeof constraints === "object") {
            if (constraints instanceof RegExp) {
              if (body.action_id.match(constraints)) {
                return handler;
              }
            } else {
              if (body.action_id === constraints.action_id) {
                if (body.block_id && body.block_id !== constraints.block_id) {
                  return null;
                }
                return handler;
              }
            }
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles type: "view_submission"/"view_closed" requests.
       * @param callbackId the constraints to match callback_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      view(callbackId, ack, lazy = exports.noopLazyHandler) {
        return this.viewSubmission(callbackId, ack, lazy).viewClosed(callbackId, ack, lazy);
      }
      /**
       * Registers a listener that handles type: "view_submission" requests.
       * @param callbackId the constraints to match callback_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      viewSubmission(callbackId, ack, lazy = exports.noopLazyHandler) {
        const handler = { ack, lazy };
        __classPrivateFieldGet(this, _SlackApp_viewSubmissions, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.ViewSubmission || !body.view) {
            return null;
          }
          if (typeof callbackId === "string" && body.view.callback_id === callbackId) {
            return handler;
          } else if (typeof callbackId === "object" && callbackId instanceof RegExp && body.view.callback_id.match(callbackId)) {
            return handler;
          }
          return null;
        });
        return this;
      }
      /**
       * Registers a listener that handles type: "view_closed" requests.
       * @param callbackId the constraints to match callback_id in a payload
       * @param ack ack function that must complete within 3 seconds
       * @param lazy lazy function that can do anything asynchronously
       * @returns this instance
       */
      viewClosed(callbackId, ack, lazy = exports.noopLazyHandler) {
        const handler = { ack, lazy };
        __classPrivateFieldGet(this, _SlackApp_viewClosed, "f").push((body) => {
          if (body.type !== payload_types_1.PayloadType.ViewClosed || !body.view) {
            return null;
          }
          if (typeof callbackId === "string" && body.view.callback_id === callbackId) {
            return handler;
          } else if (typeof callbackId === "object" && callbackId instanceof RegExp && body.view.callback_id.match(callbackId)) {
            return handler;
          }
          return null;
        });
        return this;
      }
      /**
       * Handles an http request and returns a response to it.
       * @param request request
       * @param ctx execution context
       * @returns response
       */
      async run(request, ctx = new execution_context_1.NoopExecutionContext()) {
        return await this.handleEventRequest(request, ctx);
      }
      /**
       * Establishes a WebSocket connection for Socket Mode.
       */
      async connect() {
        if (!this.socketMode) {
          throw new errors_1.ConfigError("Both env.SLACK_APP_TOKEN and socketMode: true are required to start a Socket Mode connection!");
        }
        this.socketModeClient = new socket_mode_client_1.SocketModeClient(this);
        await this.socketModeClient.connect();
      }
      /**
       * Disconnect a WebSocket connection for Socket Mode.
       */
      async disconnect() {
        if (this.socketModeClient) {
          await this.socketModeClient.disconnect();
        }
      }
      /**
       * Handles an HTTP request from Slack's API server and returns a response to it.
       * @param request request
       * @param ctx execution context
       * @returns response
       */
      async handleEventRequest(request, ctx) {
        if (this.routes.events) {
          const { pathname } = new URL(request.url);
          if (pathname !== this.routes.events) {
            return new Response("Not found", { status: 404 });
          }
        }
        const blobRequestBody = await request.blob();
        const rawBody = await blobRequestBody.text();
        if (rawBody.includes("ssl_check=")) {
          const bodyParams = new URLSearchParams(rawBody);
          if (bodyParams.get("ssl_check") === "1" && bodyParams.get("token")) {
            return new Response("", { status: 200 });
          }
        }
        const isRequestSignatureVerified = this.socketMode || await (0, request_verification_1.verifySlackRequest)(this.signingSecret, request.headers, rawBody);
        if (isRequestSignatureVerified) {
          const body = await (0, request_parser_1.parseRequestBody)(request.headers, rawBody);
          let retryNum = void 0;
          try {
            const retryNumHeader = request.headers.get("x-slack-retry-num");
            if (retryNumHeader) {
              retryNum = Number.parseInt(retryNumHeader);
            } else if (this.socketMode && body.retry_attempt) {
              retryNum = Number.parseInt(body.retry_attempt);
            }
          } catch (e) {
          }
          const retryReason = request.headers.get("x-slack-retry-reason") ?? body.retry_reason;
          const preAuthorizeRequest = {
            body,
            rawBody,
            retryNum,
            retryReason,
            context: (0, context_1.builtBaseContext)(body),
            env: this.env,
            headers: request.headers
          };
          if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
            console.log(`*** Received request body ***
 ${(0, slack_web_api_client_2.prettyPrint)(body)}`);
          }
          for (const middlware of this.preAuthorizeMiddleware) {
            const response = await middlware(preAuthorizeRequest);
            if (response) {
              return (0, response_1.toCompleteResponse)(response);
            }
          }
          let authorizeResult;
          try {
            authorizeResult = await __classPrivateFieldGet(this, _SlackApp_instances, "m", _SlackApp_callAuthorize).call(this, preAuthorizeRequest);
          } catch (error) {
            if ("name" in error && error.name === "AuthorizeError") {
              const responseOrError = await this.authorizeErrorHandler({
                request: preAuthorizeRequest,
                error
              });
              if ("name" in responseOrError && responseOrError.name === "AuthorizeError") {
                throw responseOrError;
              } else {
                return responseOrError;
              }
            } else {
              throw error;
            }
          }
          const primaryToken = preAuthorizeRequest.context.functionBotAccessToken || authorizeResult.botToken;
          const authorizedContext = {
            ...preAuthorizeRequest.context,
            authorizeResult,
            client: new slack_web_api_client_1.SlackAPIClient(primaryToken, {
              logLevel: this.env.SLACK_LOGGING_LEVEL
            }),
            botToken: authorizeResult.botToken,
            botId: authorizeResult.botId,
            botUserId: authorizeResult.botUserId,
            userToken: authorizeResult.userToken
          };
          if (authorizedContext.channelId) {
            const context = authorizedContext;
            const primaryToken2 = context.functionBotAccessToken || context.botToken;
            const client = new slack_web_api_client_1.SlackAPIClient(primaryToken2);
            if (authorizedContext.isAssistantThreadEvent) {
              const assistantContext = authorizedContext;
              const { channelId: channel_id, threadTs: thread_ts } = assistantContext;
              assistantContext.setStatus = async ({ status }) => await client.assistant.threads.setStatus({ channel_id, thread_ts, status });
              assistantContext.setTitle = async ({ title }) => await client.assistant.threads.setTitle({ channel_id, thread_ts, title });
              assistantContext.setSuggestedPrompts = async ({ title, prompts }) => {
                const promptsArgs = [];
                for (const p of prompts) {
                  if (typeof p === "string") {
                    promptsArgs.push({ message: p, title: p });
                  } else {
                    promptsArgs.push(p);
                  }
                }
                return await client.assistant.threads.setSuggestedPrompts({ channel_id, thread_ts, prompts: promptsArgs, title });
              };
              const threadContextStore = this.assistantThreadContextStore ?? new thread_context_store_1.DefaultAssistantThreadContextStore({
                client,
                thisBotUserId: context.botUserId
              });
              assistantContext.threadContextStore = threadContextStore;
              assistantContext.saveThreadContextStore = async (newContext) => {
                await threadContextStore.save({ channel_id, thread_ts }, newContext);
              };
              const threadContext = await threadContextStore.find({ channel_id, thread_ts }) || (body.event.assistant_thread?.context && Object.keys(body.event.assistant_thread.context).length > 0 ? body.event.assistant_thread?.context : void 0);
              if (threadContext) {
                assistantContext.threadContext = threadContext;
              }
              context.say = async (params) => await client.chat.postMessage({
                channel: channel_id,
                thread_ts,
                metadata: threadContext ? {
                  event_type: "assistant_thread_context",
                  event_payload: { ...threadContext }
                } : void 0,
                ...params
              });
            } else {
              context.say = async (params) => await client.chat.postMessage({
                channel: context.channelId,
                thread_ts: context.threadTs,
                // for assistant apps
                ...params
              });
            }
          }
          if (authorizedContext.responseUrl) {
            const responseUrl = authorizedContext.responseUrl;
            authorizedContext.respond = async (params) => {
              return new slack_web_api_client_1.ResponseUrlSender(responseUrl).call(params);
            };
          }
          const baseRequest = {
            ...preAuthorizeRequest,
            context: authorizedContext
          };
          for (const middlware of this.postAuthorizeMiddleware) {
            const response = await middlware(baseRequest);
            if (response) {
              return (0, response_1.toCompleteResponse)(response);
            }
          }
          const payload = body;
          if (body.type === payload_types_1.PayloadType.EventsAPI) {
            const slackRequest = {
              payload: body.event,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_events, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
            if (payload.event?.type === "assistant_thread_context_changed") {
              const handler = new assistant_1.Assistant({ threadContextStore: this.assistantThreadContextStore }).threadContextChangedHandler;
              if (!this.startLazyListenerAfterAck) {
                const req = slackRequest;
                ctx.waitUntil(handler(req));
                return (0, response_1.toCompleteResponse)();
              }
            }
          } else if (!body.type && body.command) {
            const slackRequest = {
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_slashCommands, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          } else if (body.type === payload_types_1.PayloadType.GlobalShortcut) {
            const slackRequest = {
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_globalShorcuts, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          } else if (body.type === payload_types_1.PayloadType.MessageShortcut) {
            const slackRequest = {
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_messageShorcuts, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          } else if (body.type === payload_types_1.PayloadType.BlockAction) {
            const slackRequest = {
              // deno-lint-ignore no-explicit-any
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_blockActions, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          } else if (body.type === payload_types_1.PayloadType.BlockSuggestion) {
            const slackRequest = {
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_blockSuggestions, "f")) {
              const handler = matcher(payload);
              if (handler) {
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          } else if (body.type === payload_types_1.PayloadType.ViewSubmission) {
            const slackRequest = {
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_viewSubmissions, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          } else if (body.type === payload_types_1.PayloadType.ViewClosed) {
            const slackRequest = {
              payload: body,
              ...baseRequest
            };
            for (const matcher of __classPrivateFieldGet(this, _SlackApp_viewClosed, "f")) {
              const handler = matcher(payload);
              if (handler) {
                if (!this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                const slackResponse = await handler.ack(slackRequest);
                if ((0, slack_web_api_client_2.isDebugLogEnabled)(this.env.SLACK_LOGGING_LEVEL)) {
                  console.log(`*** Slack response ***
${(0, slack_web_api_client_2.prettyPrint)(slackResponse)}`);
                }
                if (this.startLazyListenerAfterAck) {
                  ctx.waitUntil(handler.lazy(slackRequest));
                }
                return (0, response_1.toCompleteResponse)(slackResponse);
              }
            }
          }
          console.log(`*** No listener found ***
${JSON.stringify(baseRequest.body)}`);
          return new Response("No listener found", { status: 404 });
        }
        return new Response("Invalid signature", { status: 401 });
      }
    };
    __name(SlackApp2, "SlackApp");
    exports.SlackApp = SlackApp2;
    _SlackApp_slashCommands = /* @__PURE__ */ new WeakMap(), _SlackApp_events = /* @__PURE__ */ new WeakMap(), _SlackApp_globalShorcuts = /* @__PURE__ */ new WeakMap(), _SlackApp_messageShorcuts = /* @__PURE__ */ new WeakMap(), _SlackApp_blockActions = /* @__PURE__ */ new WeakMap(), _SlackApp_blockSuggestions = /* @__PURE__ */ new WeakMap(), _SlackApp_viewSubmissions = /* @__PURE__ */ new WeakMap(), _SlackApp_viewClosed = /* @__PURE__ */ new WeakMap(), _SlackApp_instances = /* @__PURE__ */ new WeakSet(), _SlackApp_assistantEvent = /* @__PURE__ */ __name(function _SlackApp_assistantEvent2(event, lazy, handleSelfBotMessageEvents = false) {
      __classPrivateFieldGet(this, _SlackApp_events, "f").push((body) => {
        if (body.type !== payload_types_1.PayloadType.EventsAPI || !body.event) {
          return null;
        }
        if (body.event.type === event && (0, context_1.isAssitantThreadEvent)(body)) {
          if (event === "message" && "bot_profile" in body.event) {
            if (handleSelfBotMessageEvents) {
              return { ack: async () => "", lazy };
            } else {
              return null;
            }
          } else {
            return { ack: async () => "", lazy };
          }
        }
        return null;
      });
      return this;
    }, "_SlackApp_assistantEvent"), _SlackApp_callAuthorize = /* @__PURE__ */ __name(async function _SlackApp_callAuthorize2(request) {
      const body = request.body;
      if (body.type === payload_types_1.PayloadType.EventsAPI && body.event && this.eventsToSkipAuthorize.includes(body.event.type)) {
        return {
          enterpriseId: request.context.actorEnterpriseId,
          teamId: request.context.actorTeamId,
          team: request.context.actorTeamId,
          botId: request.context.botId || "N/A",
          botUserId: request.context.botUserId || "N/A",
          botToken: "N/A",
          botScopes: [],
          userId: request.context.actorUserId,
          user: request.context.actorUserId,
          userToken: "N/A",
          userScopes: []
        };
      }
      return await this.authorize(request);
    }, "_SlackApp_callAuthorize");
    var noopLazyHandler = /* @__PURE__ */ __name(async () => {
    }, "noopLazyHandler");
    exports.noopLazyHandler = noopLazyHandler;
  }
});

// node_modules/slack-edge/dist/app-env.js
var require_app_env = __commonJS({
  "node_modules/slack-edge/dist/app-env.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/assistant/thread-context.js
var require_thread_context = __commonJS({
  "node_modules/slack-edge/dist/assistant/thread-context.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/oauth/error-codes.js
var require_error_codes = __commonJS({
  "node_modules/slack-edge/dist/oauth/error-codes.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenIDConnectError = exports.CompletionPageError = exports.InstallationStoreError = exports.InstallationError = exports.MissingCode = exports.InvalidStateParameter = void 0;
    exports.InvalidStateParameter = {
      code: "invalid-state",
      message: "The state parameter is missing or invalid"
    };
    exports.MissingCode = {
      code: "missing-code",
      message: "The code parameter is missing"
    };
    exports.InstallationError = {
      code: "installation-error",
      message: "The installation process failed"
    };
    exports.InstallationStoreError = {
      code: "installation-store-error",
      message: "Saving the installation data failed"
    };
    exports.CompletionPageError = {
      code: "completion-page-failure",
      message: "Rendering the completion page failed"
    };
    exports.OpenIDConnectError = {
      code: "oidc-error",
      message: "The OpenID Connect process failed"
    };
  }
});

// node_modules/slack-edge/dist/handler/handler.js
var require_handler = __commonJS({
  "node_modules/slack-edge/dist/handler/handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/handler/message-handler.js
var require_message_handler = __commonJS({
  "node_modules/slack-edge/dist/handler/message-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/handler/options-handler.js
var require_options_handler = __commonJS({
  "node_modules/slack-edge/dist/handler/options-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/handler/view-handler.js
var require_view_handler = __commonJS({
  "node_modules/slack-edge/dist/handler/view-handler.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/authorization/authorize.js
var require_authorize = __commonJS({
  "node_modules/slack-edge/dist/authorization/authorize.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/authorization/authorize-result.js
var require_authorize_result = __commonJS({
  "node_modules/slack-edge/dist/authorization/authorize-result.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/middleware/middleware.js
var require_middleware = __commonJS({
  "node_modules/slack-edge/dist/middleware/middleware.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/oauth/state-store.js
var require_state_store = __commonJS({
  "node_modules/slack-edge/dist/oauth/state-store.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoStorageStateStore = void 0;
    var NoStorageStateStore = class {
      // deno-lint-ignore require-await
      async issueNewState() {
        return crypto.randomUUID();
      }
      // deno-lint-ignore require-await no-unused-vars
      async consume(state) {
        return true;
      }
    };
    __name(NoStorageStateStore, "NoStorageStateStore");
    exports.NoStorageStateStore = NoStorageStateStore;
  }
});

// node_modules/slack-edge/dist/oauth/authorize-url-generator.js
var require_authorize_url_generator = __commonJS({
  "node_modules/slack-edge/dist/oauth/authorize-url-generator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateAuthorizeUrl = generateAuthorizeUrl;
    function generateAuthorizeUrl(state, env, team = void 0) {
      let url = `https://slack.com/oauth/v2/authorize?state=${state}`;
      url += `&client_id=${env.SLACK_CLIENT_ID}`;
      url += `&scope=${env.SLACK_BOT_SCOPES}`;
      if (env.SLACK_USER_SCOPES) {
        url += `&user_scope=${env.SLACK_USER_SCOPES}`;
      }
      if (env.SLACK_REDIRECT_URI) {
        url += `&redirect_uri=${env.SLACK_REDIRECT_URI}`;
      }
      if (team) {
        url += `&team=${team}`;
      }
      return url;
    }
    __name(generateAuthorizeUrl, "generateAuthorizeUrl");
  }
});

// node_modules/slack-edge/dist/cookie.js
var require_cookie = __commonJS({
  "node_modules/slack-edge/dist/cookie.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    function parse(str, options = void 0) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      const obj = {};
      const opt = options || {};
      const dec = opt.decode || decode;
      let index = 0;
      while (index < str.length) {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) {
          break;
        }
        let endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = str.slice(index, eqIdx).trim();
        if (void 0 === obj[key]) {
          let val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      }
      return obj;
    }
    __name(parse, "parse");
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    __name(decode, "decode");
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
    __name(tryDecode, "tryDecode");
  }
});

// node_modules/slack-edge/dist/oauth/installation.js
var require_installation = __commonJS({
  "node_modules/slack-edge/dist/oauth/installation.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toInstallation = toInstallation;
    function toInstallation(oauthAccess) {
      const installation = {
        app_id: oauthAccess.app_id,
        is_enterprise_install: oauthAccess.is_enterprise_install,
        enterprise_id: oauthAccess.enterprise?.id,
        team_id: oauthAccess.team?.id,
        user_id: oauthAccess.authed_user?.id,
        // bot token
        bot_token: oauthAccess.access_token,
        bot_user_id: oauthAccess.bot_user_id,
        bot_scopes: oauthAccess.scope?.split(","),
        bot_refresh_token: oauthAccess.refresh_token,
        bot_token_expires_at: oauthAccess.expires_in ? (/* @__PURE__ */ new Date()).getTime() / 1e3 + oauthAccess.expires_in : void 0,
        // user token
        user_token: oauthAccess.authed_user?.access_token,
        user_scopes: oauthAccess.authed_user?.scope?.split(","),
        user_refresh_token: oauthAccess.authed_user?.refresh_token,
        user_token_expires_at: oauthAccess.authed_user?.expires_in ? (/* @__PURE__ */ new Date()).getTime() / 1e3 + oauthAccess.authed_user?.expires_in : void 0,
        // Only when having incoming-webhooks
        incoming_webhook_url: oauthAccess.incoming_webhook?.url,
        incoming_webhook_channel_id: oauthAccess.incoming_webhook?.channel_id,
        incoming_webhook_configuration_url: oauthAccess.incoming_webhook?.url
      };
      return installation;
    }
    __name(toInstallation, "toInstallation");
  }
});

// node_modules/slack-edge/dist/oauth/escape-html.js
var require_escape_html = __commonJS({
  "node_modules/slack-edge/dist/oauth/escape-html.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeHtml = escapeHtml;
    function escapeHtml(input) {
      if (input) {
        return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      return "";
    }
    __name(escapeHtml, "escapeHtml");
  }
});

// node_modules/slack-edge/dist/oauth/oauth-page-renderer.js
var require_oauth_page_renderer = __commonJS({
  "node_modules/slack-edge/dist/oauth/oauth-page-renderer.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderDefaultOAuthStartPage = renderDefaultOAuthStartPage;
    exports.renderSimpleCSSOAuthStartPage = renderSimpleCSSOAuthStartPage;
    exports.renderDefaultOAuthErrorPage = renderDefaultOAuthErrorPage;
    exports.renderSimpleCSSOAuthErrorPage = renderSimpleCSSOAuthErrorPage;
    exports.renderDefaultOAuthCompletionPage = renderDefaultOAuthCompletionPage;
    exports.renderSimpleCSSOAuthCompletionPage = renderSimpleCSSOAuthCompletionPage;
    var escape_html_1 = require_escape_html();
    async function renderDefaultOAuthStartPage({ url, immediateRedirect }) {
      const meta = immediateRedirect ? `<meta http-equiv="refresh" content="2;url=${(0, escape_html_1.escapeHtml)(url)}'" />` : "";
      return "<html><head>" + meta + '<title>Redirecting to Slack ...</title></head><body>Redirecting to the Slack OAuth page ... Click <a href="' + (0, escape_html_1.escapeHtml)(url) + '">here</a> to continue.</body></html>';
    }
    __name(renderDefaultOAuthStartPage, "renderDefaultOAuthStartPage");
    async function renderSimpleCSSOAuthStartPage({ url, immediateRedirect }) {
      const meta = immediateRedirect ? `<meta http-equiv="refresh" content="2;url=${(0, escape_html_1.escapeHtml)(url)}'" />` : "";
      return `<html>
      <head>
      ${meta}
      <title>Redirecting to Slack ...</title>
      <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
      </head>
      <body>
      <main>
      <h2>Installing Slack App</h2>
      <p>Redirecting to the Slack OAuth page ... Click <a href="${(0, escape_html_1.escapeHtml)(url)}">here</a> to continue.</p>
      </main>
      </body>
      </html>`;
    }
    __name(renderSimpleCSSOAuthStartPage, "renderSimpleCSSOAuthStartPage");
    async function renderDefaultOAuthErrorPage({ installPath, reason }) {
      return '<html><head><style>body {{ padding: 10px 15px; font-family: verdana; text-align: center; }}</style></head><body><h2>Oops, Something Went Wrong!</h2><p>Please try again from <a href="' + (0, escape_html_1.escapeHtml)(installPath) + '">here</a> or contact the app owner (reason: ' + (0, escape_html_1.escapeHtml)(reason.message) + ")</p></body></html>";
    }
    __name(renderDefaultOAuthErrorPage, "renderDefaultOAuthErrorPage");
    async function renderSimpleCSSOAuthErrorPage({ installPath, reason }) {
      return `<html>
      <head>
      <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
      </head>
      <body>
      <main>
      <h2>Oops, Something Went Wrong!</h2>
      <p>Please try again from <a href="${(0, escape_html_1.escapeHtml)(installPath)}">here</a> or contact the app owner (reason: ${(0, escape_html_1.escapeHtml)(reason.message)})</p>
      </main>
      </body>
      </html>`;
    }
    __name(renderSimpleCSSOAuthErrorPage, "renderSimpleCSSOAuthErrorPage");
    async function renderDefaultOAuthCompletionPage({ appId, teamId, isEnterpriseInstall, enterpriseUrl }) {
      let url = `slack://app?team=${teamId}&id=${appId}`;
      if (isEnterpriseInstall && enterpriseUrl !== void 0) {
        url = `${enterpriseUrl}manage/organization/apps/profile/${appId}/workspaces/add`;
      }
      const browserUrl = `https://app.slack.com/client/${teamId}`;
      return '<html><head><meta http-equiv="refresh" content="0; URL=' + (0, escape_html_1.escapeHtml)(url) + '"><style>body {{ padding: 10px 15px; font-family: verdana; text-align: center; }}</style></head><body><h2>Thank you!</h2><p>Redirecting to the Slack App... click <a href="' + (0, escape_html_1.escapeHtml)(url) + '">here</a>. If you use the browser version of Slack, click <a href="' + (0, escape_html_1.escapeHtml)(browserUrl) + '" target="_blank">this link</a> instead.</p></body></html>';
    }
    __name(renderDefaultOAuthCompletionPage, "renderDefaultOAuthCompletionPage");
    async function renderSimpleCSSOAuthCompletionPage({ appId, teamId, isEnterpriseInstall, enterpriseUrl }) {
      let url = `slack://app?team=${teamId}&id=${appId}`;
      if (isEnterpriseInstall && enterpriseUrl !== void 0) {
        url = `${enterpriseUrl}manage/organization/apps/profile/${appId}/workspaces/add`;
      }
      const browserUrl = `https://app.slack.com/client/${teamId}`;
      return `<html>
      <head>
      <meta http-equiv="refresh" content="0; URL=${(0, escape_html_1.escapeHtml)(url)}">
      <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
      </head>
      <body>
      <main>
      <h2>Thank you!</h2>
      <p>Redirecting to the Slack App... click <a href="${(0, escape_html_1.escapeHtml)(url)}">here</a>.
      If you use the browser version of Slack, click <a href="${(0, escape_html_1.escapeHtml)(browserUrl)}" target="_blank">this link</a> instead.</p>
      </main>
      </body>
      </html>`;
    }
    __name(renderSimpleCSSOAuthCompletionPage, "renderSimpleCSSOAuthCompletionPage");
  }
});

// node_modules/slack-edge/dist/oauth/hook.js
var require_hook = __commonJS({
  "node_modules/slack-edge/dist/oauth/hook.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultOnStateValidationError = defaultOnStateValidationError;
    exports.defaultOnFailure = defaultOnFailure;
    exports.defaultOAuthStart = defaultOAuthStart;
    exports.defaultOAuthCallback = defaultOAuthCallback;
    var error_codes_1 = require_error_codes();
    var oauth_page_renderer_1 = require_oauth_page_renderer();
    function defaultOnStateValidationError(renderer) {
      return async ({ startPath }) => {
        const renderPage = renderer ?? oauth_page_renderer_1.renderDefaultOAuthErrorPage;
        return new Response(await renderPage({
          installPath: startPath,
          reason: error_codes_1.InvalidStateParameter
        }), {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      };
    }
    __name(defaultOnStateValidationError, "defaultOnStateValidationError");
    function defaultOnFailure(renderer) {
      return async ({ startPath, reason }) => {
        const renderPage = renderer ?? oauth_page_renderer_1.renderDefaultOAuthErrorPage;
        return new Response(await renderPage({ installPath: startPath, reason }), {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      };
    }
    __name(defaultOnFailure, "defaultOnFailure");
    function defaultOAuthStart(startImmediateRedirect, renderer) {
      return async ({ authorizeUrl, stateCookieName, stateValue }) => {
        const immediateRedirect = startImmediateRedirect !== false;
        const status = immediateRedirect ? 302 : 200;
        const renderPage = renderer ?? oauth_page_renderer_1.renderDefaultOAuthStartPage;
        return new Response(await renderPage({ immediateRedirect, url: authorizeUrl }), {
          status,
          headers: {
            Location: authorizeUrl,
            "Set-Cookie": `${stateCookieName}=${stateValue}; Secure; HttpOnly; Path=/; Max-Age=300`,
            "Content-Type": "text/html; charset=utf-8"
          }
        });
      };
    }
    __name(defaultOAuthStart, "defaultOAuthStart");
    function defaultOAuthCallback(renderer) {
      return async ({ oauthAccess, enterpriseUrl, stateCookieName, installation, authTestResponse }) => {
        const renderPage = renderer ?? oauth_page_renderer_1.renderDefaultOAuthCompletionPage;
        return new Response(await renderPage({
          appId: oauthAccess.app_id,
          teamId: oauthAccess.team?.id,
          isEnterpriseInstall: oauthAccess.is_enterprise_install,
          enterpriseUrl,
          installation,
          authTestResponse
        }), {
          status: 200,
          headers: {
            "Set-Cookie": `${stateCookieName}=deleted; Secure; HttpOnly; Path=/; Max-Age=0`,
            "Content-Type": "text/html; charset=utf-8"
          }
        });
      };
    }
    __name(defaultOAuthCallback, "defaultOAuthCallback");
  }
});

// node_modules/slack-edge/dist/oidc/hook.js
var require_hook2 = __commonJS({
  "node_modules/slack-edge/dist/oidc/hook.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultOpenIDConnectCallback = void 0;
    var slack_web_api_client_1 = require_dist();
    var slack_web_api_client_2 = require_dist();
    var defaultOpenIDConnectCallback = /* @__PURE__ */ __name(async ({ env, token }) => {
      const client = new slack_web_api_client_1.SlackAPIClient(token.access_token, {
        logLevel: env.SLACK_LOGGING_LEVEL
      });
      const userInfo = await client.openid.connect.userInfo();
      const body = `<html><head><style>body {{ padding: 10px 15px; font-family: verdana; text-align: center; }}</style></head><body><h1>It works!</h1><p>This is the default handler. To change this, pass \`oidc: { callback: async (token, req) => new Response("TODO") }\` to your SlackOAuthApp constructor.</p><pre>${(0, slack_web_api_client_2.prettyPrint)(userInfo)}</pre></body></html>`;
      return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }, "defaultOpenIDConnectCallback");
    exports.defaultOpenIDConnectCallback = defaultOpenIDConnectCallback;
  }
});

// node_modules/slack-edge/dist/oidc/authorize-url-generator.js
var require_authorize_url_generator2 = __commonJS({
  "node_modules/slack-edge/dist/oidc/authorize-url-generator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateOIDCAuthorizeUrl = generateOIDCAuthorizeUrl;
    var errors_1 = require_errors2();
    function generateOIDCAuthorizeUrl(state, env) {
      if (!env.SLACK_OIDC_SCOPES) {
        throw new errors_1.ConfigError("env.SLACK_OIDC_SCOPES must be present when enabling Sign in with Slack (OpenID Connect)");
      }
      if (!env.SLACK_OIDC_REDIRECT_URI) {
        throw new errors_1.ConfigError("env.SLACK_OIDC_REDIRECT_URI must be present when enabling Sign in with Slack (OpenID Connect)");
      }
      let url = `https://slack.com/openid/connect/authorize?response_type=code&state=${state}`;
      url += `&client_id=${env.SLACK_CLIENT_ID}`;
      url += `&scope=${env.SLACK_OIDC_SCOPES}`;
      url += `&redirect_uri=${env.SLACK_OIDC_REDIRECT_URI}`;
      return url;
    }
    __name(generateOIDCAuthorizeUrl, "generateOIDCAuthorizeUrl");
  }
});

// node_modules/slack-edge/dist/oauth-app.js
var require_oauth_app = __commonJS({
  "node_modules/slack-edge/dist/oauth-app.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _SlackOAuthApp_instances;
    var _SlackOAuthApp_enableTokenRevocationHandlers;
    var _SlackOAuthApp_validateStateParameter;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SlackOAuthApp = void 0;
    var execution_context_1 = require_execution_context();
    var app_1 = require_app();
    var state_store_1 = require_state_store();
    var authorize_url_generator_1 = require_authorize_url_generator();
    var cookie_1 = require_cookie();
    var slack_web_api_client_1 = require_dist();
    var installation_1 = require_installation();
    var hook_1 = require_hook();
    var hook_2 = require_hook2();
    var authorize_url_generator_2 = require_authorize_url_generator2();
    var error_codes_1 = require_error_codes();
    var SlackOAuthApp = class extends app_1.SlackApp {
      constructor(options) {
        super({
          env: options.env,
          authorize: options.installationStore.toAuthorize(),
          authorizeErrorHandler: options.authorizeErrorHandler,
          routes: { events: options.routes?.events ?? "/slack/events" },
          startLazyListenerAfterAck: options.startLazyListenerAfterAck,
          ignoreSelfEvents: options.ignoreSelfEvents,
          assistantThreadContextStore: options.assistantThreadContextStore
        });
        _SlackOAuthApp_instances.add(this);
        this.env = options.env;
        this.installationStore = options.installationStore;
        this.stateStore = options.stateStore ?? new state_store_1.NoStorageStateStore();
        this.oauth = {
          stateCookieName: options.oauth?.stateCookieName ?? "slack-app-oauth-state",
          onFailure: options.oauth?.onFailure ?? (0, hook_1.defaultOnFailure)(options.oauth?.onFailureRenderer),
          onStateValidationError: options.oauth?.onStateValidationError ?? (0, hook_1.defaultOnStateValidationError)(options.oauth?.onStateValidationRenderer),
          redirectUri: options.oauth?.redirectUri ?? this.env.SLACK_REDIRECT_URI,
          start: options.oauth?.start ?? (0, hook_1.defaultOAuthStart)(options.oauth?.startImmediateRedirect, options.oauth?.startRenderer),
          beforeInstallation: options.oauth?.beforeInstallation,
          afterInstallation: options.oauth?.afterInstallation,
          callback: options.oauth?.callback ?? (0, hook_1.defaultOAuthCallback)(options.oauth?.callbackRenderer)
        };
        if (options.oidc) {
          this.oidc = {
            stateCookieName: options.oidc.stateCookieName ?? "slack-app-oidc-state",
            onFailure: options.oidc.onFailure ?? (0, hook_1.defaultOnFailure)(options.oidc?.onFailureRenderer),
            onStateValidationError: options.oidc.onStateValidationError ?? (0, hook_1.defaultOnStateValidationError)(options.oidc?.onStateValidationRenderer),
            start: options.oidc?.start ?? (0, hook_1.defaultOAuthStart)(options.oidc?.startImmediateRedirect, options.oidc?.startRenderer),
            callback: options.oidc.callback ?? hook_2.defaultOpenIDConnectCallback,
            redirectUri: options.oidc.redirectUri ?? this.env.SLACK_OIDC_REDIRECT_URI
          };
        } else {
          this.oidc = void 0;
        }
        this.routes = options.routes ? options.routes : {
          events: "/slack/events",
          oauth: {
            start: "/slack/install",
            callback: "/slack/oauth_redirect"
          },
          oidc: {
            start: "/slack/login",
            callback: "/slack/login/callback"
          }
        };
        __classPrivateFieldGet(this, _SlackOAuthApp_instances, "m", _SlackOAuthApp_enableTokenRevocationHandlers).call(this, options.installationStore);
      }
      async run(request, ctx = new execution_context_1.NoopExecutionContext()) {
        const url = new URL(request.url);
        if (request.method === "GET") {
          if (url.pathname === this.routes.oauth.start) {
            return await this.handleOAuthStartRequest(request);
          } else if (url.pathname === this.routes.oauth.callback) {
            return await this.handleOAuthCallbackRequest(request);
          }
          if (this.routes.oidc) {
            if (url.pathname === this.routes.oidc.start) {
              return await this.handleOIDCStartRequest(request);
            } else if (url.pathname === this.routes.oidc.callback) {
              return await this.handleOIDCCallbackRequest(request);
            }
          }
        } else if (request.method === "POST") {
          if (url.pathname === this.routes.events) {
            return await this.handleEventRequest(request, ctx);
          }
        }
        return new Response("Not found", { status: 404 });
      }
      /**
       * Handles an HTTP request from Slack's API server and returns a response to it.
       * @param request request
       * @param ctx execution context
       * @returns response
       */
      async handleEventRequest(request, ctx) {
        return await super.handleEventRequest(request, ctx);
      }
      /**
       * Handles an HTTP request to initiate the app-installation OAuth flow within a web browser.
       * @param request request
       * @returns response
       */
      async handleOAuthStartRequest(request) {
        const stateValue = await this.stateStore.issueNewState();
        const url = new URL(request.url);
        const team = url.searchParams.get("team") || void 0;
        const authorizeUrl = (0, authorize_url_generator_1.generateAuthorizeUrl)(stateValue, this.env, team);
        return await this.oauth.start({
          env: this.env,
          authorizeUrl,
          stateCookieName: this.oauth.stateCookieName,
          stateValue,
          request
        });
      }
      /**
       * Handles an HTTP request to handle the app-installation OAuth flow callback within a web browser.
       * @param request request
       * @returns response
       */
      async handleOAuthCallbackRequest(request) {
        const errorResponse = await __classPrivateFieldGet(this, _SlackOAuthApp_instances, "m", _SlackOAuthApp_validateStateParameter).call(this, request, this.routes.oauth.start, this.oauth.stateCookieName);
        if (errorResponse) {
          return errorResponse;
        }
        const { searchParams } = new URL(request.url);
        const error = searchParams.get("error");
        if (!error && error !== null) {
          return await this.oauth.onFailure({
            env: this.env,
            startPath: this.routes.oauth.start,
            reason: { code: error, message: `The installation process failed due to "${error}"` },
            request
          });
        }
        const code = searchParams.get("code");
        if (!code) {
          return await this.oauth.onFailure({
            env: this.env,
            startPath: this.routes.oauth.start,
            reason: error_codes_1.MissingCode,
            request
          });
        }
        if (this.oauth.beforeInstallation) {
          const response = await this.oauth.beforeInstallation({
            env: this.env,
            request
          });
          if (response) {
            return response;
          }
        }
        const client = new slack_web_api_client_1.SlackAPIClient(void 0, {
          logLevel: this.env.SLACK_LOGGING_LEVEL
        });
        let oauthAccess;
        try {
          oauthAccess = await client.oauth.v2.access({
            client_id: this.env.SLACK_CLIENT_ID,
            client_secret: this.env.SLACK_CLIENT_SECRET,
            redirect_uri: this.oauth.redirectUri,
            code
          });
        } catch (e) {
          console.log(e);
          return await this.oauth.onFailure({
            env: this.env,
            startPath: this.routes.oauth.start,
            reason: error_codes_1.InstallationError,
            request
          });
        }
        const installation = (0, installation_1.toInstallation)(oauthAccess);
        if (this.oauth.afterInstallation) {
          const response = await this.oauth.afterInstallation({
            env: this.env,
            request,
            installation
          });
          if (response) {
            return response;
          }
        }
        try {
          await this.installationStore.save(installation, request);
        } catch (e) {
          console.log(e);
          return await this.oauth.onFailure({
            env: this.env,
            startPath: this.routes.oauth.start,
            reason: error_codes_1.InstallationStoreError,
            request
          });
        }
        try {
          const authTestResponse = await client.auth.test({
            token: oauthAccess.access_token
          });
          const enterpriseUrl = authTestResponse.url;
          return await this.oauth.callback({
            env: this.env,
            oauthAccess,
            enterpriseUrl,
            stateCookieName: this.oauth.stateCookieName,
            installation,
            authTestResponse,
            request
          });
        } catch (e) {
          console.log(e);
          return await this.oauth.onFailure({
            env: this.env,
            startPath: this.routes.oauth.start,
            reason: error_codes_1.CompletionPageError,
            request
          });
        }
      }
      /**
       * Handles an HTTP request to initiate the SIWS flow within a web browser.
       * @param request request
       * @returns response
       */
      async handleOIDCStartRequest(request) {
        if (!this.oidc) {
          return new Response("Not found", { status: 404 });
        }
        const stateValue = await this.stateStore.issueNewState();
        const authorizeUrl = (0, authorize_url_generator_2.generateOIDCAuthorizeUrl)(stateValue, this.env);
        return await this.oauth.start({
          env: this.env,
          authorizeUrl,
          stateCookieName: this.oidc.stateCookieName,
          stateValue,
          request
        });
      }
      /**
       * Handles an HTTP request to handle the SIWS callback within a web browser.
       * @param request request
       * @returns response
       */
      async handleOIDCCallbackRequest(request) {
        if (!this.oidc || !this.routes.oidc) {
          return new Response("Not found", { status: 404 });
        }
        const errorResponse = await __classPrivateFieldGet(this, _SlackOAuthApp_instances, "m", _SlackOAuthApp_validateStateParameter).call(this, request, this.routes.oidc.start, this.oidc.stateCookieName);
        if (errorResponse) {
          return errorResponse;
        }
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        if (!code) {
          return await this.oidc.onFailure({
            env: this.env,
            startPath: this.routes.oidc.start,
            reason: error_codes_1.MissingCode,
            request
          });
        }
        try {
          const client = new slack_web_api_client_1.SlackAPIClient(void 0, {
            logLevel: this.env.SLACK_LOGGING_LEVEL
          });
          const token = await client.openid.connect.token({
            client_id: this.env.SLACK_CLIENT_ID,
            client_secret: this.env.SLACK_CLIENT_SECRET,
            redirect_uri: this.oidc.redirectUri,
            code
          });
          return await this.oidc.callback({
            env: this.env,
            token,
            request
          });
        } catch (e) {
          console.log(e);
          return await this.oidc.onFailure({
            env: this.env,
            startPath: this.routes.oidc.start,
            reason: error_codes_1.OpenIDConnectError,
            request
          });
        }
      }
    };
    __name(SlackOAuthApp, "SlackOAuthApp");
    exports.SlackOAuthApp = SlackOAuthApp;
    _SlackOAuthApp_instances = /* @__PURE__ */ new WeakSet(), _SlackOAuthApp_enableTokenRevocationHandlers = /* @__PURE__ */ __name(function _SlackOAuthApp_enableTokenRevocationHandlers2(installationStore) {
      this.event("tokens_revoked", async ({ payload, body }) => {
        if (payload.tokens.bot) {
          try {
            await installationStore.deleteBotInstallation({
              enterpriseId: body.enterprise_id,
              teamId: body.team_id
            });
          } catch (e) {
            console.log(`Failed to delete a bot installation (error: ${e})`);
          }
        }
        if (payload.tokens.oauth) {
          for (const userId of payload.tokens.oauth) {
            try {
              await installationStore.deleteUserInstallation({
                enterpriseId: body.enterprise_id,
                teamId: body.team_id,
                userId
              });
            } catch (e) {
              console.log(`Failed to delete a user installation (error: ${e})`);
            }
          }
        }
      });
      this.event("app_uninstalled", async ({ body }) => {
        try {
          await installationStore.deleteAll({
            enterpriseId: body.enterprise_id,
            teamId: body.team_id
          });
        } catch (e) {
          console.log(`Failed to delete all installation for an app_uninstalled event (error: ${e})`);
        }
      });
      this.event("app_uninstalled_team", async ({ body }) => {
        try {
          await installationStore.deleteAll({
            enterpriseId: body.enterprise_id,
            teamId: body.team_id
          });
        } catch (e) {
          console.log(`Failed to delete all installation for an app_uninstalled_team event (error: ${e})`);
        }
      });
    }, "_SlackOAuthApp_enableTokenRevocationHandlers"), _SlackOAuthApp_validateStateParameter = /* @__PURE__ */ __name(async function _SlackOAuthApp_validateStateParameter2(request, startPath, cookieName) {
      const { searchParams } = new URL(request.url);
      const queryState = searchParams.get("state");
      const cookie = (0, cookie_1.parse)(request.headers.get("Cookie") || "");
      const cookieState = cookie[cookieName];
      if (queryState !== cookieState || !await this.stateStore.consume(queryState)) {
        if (startPath === this.routes.oauth.start) {
          return await this.oauth.onStateValidationError({
            env: this.env,
            startPath,
            request
          });
        } else if (this.oidc && this.routes.oidc && startPath === this.routes.oidc.start) {
          return await this.oidc.onStateValidationError({
            env: this.env,
            startPath,
            request
          });
        }
      }
      return void 0;
    }, "_SlackOAuthApp_validateStateParameter");
  }
});

// node_modules/slack-edge/dist/oauth/installation-store.js
var require_installation_store = __commonJS({
  "node_modules/slack-edge/dist/oauth/installation-store.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/oidc/login.js
var require_login = __commonJS({
  "node_modules/slack-edge/dist/oidc/login.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toLogin = toLogin;
    function toLogin(token, userInfo) {
      return {
        enterprise_id: userInfo["https://slack.com/enterprise_id"],
        team_id: userInfo["https://slack.com/team_id"],
        user_id: userInfo["https://slack.com/user_id"],
        email: userInfo.email,
        picture: userInfo.picture,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        token_expires_at: token.expires_in ? (/* @__PURE__ */ new Date()).getTime() / 1e3 + token.expires_in : void 0
      };
    }
    __name(toLogin, "toLogin");
  }
});

// node_modules/slack-edge/dist/request/request-body.js
var require_request_body = __commonJS({
  "node_modules/slack-edge/dist/request/request-body.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/request.js
var require_request2 = __commonJS({
  "node_modules/slack-edge/dist/request/request.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/block-action.js
var require_block_action = __commonJS({
  "node_modules/slack-edge/dist/request/payload/block-action.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/block-suggestion.js
var require_block_suggestion = __commonJS({
  "node_modules/slack-edge/dist/request/payload/block-suggestion.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/event.js
var require_event = __commonJS({
  "node_modules/slack-edge/dist/request/payload/event.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/global-shortcut.js
var require_global_shortcut = __commonJS({
  "node_modules/slack-edge/dist/request/payload/global-shortcut.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/message-shortcut.js
var require_message_shortcut = __commonJS({
  "node_modules/slack-edge/dist/request/payload/message-shortcut.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/slash-command.js
var require_slash_command = __commonJS({
  "node_modules/slack-edge/dist/request/payload/slash-command.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/view-submission.js
var require_view_submission = __commonJS({
  "node_modules/slack-edge/dist/request/payload/view-submission.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/view-closed.js
var require_view_closed = __commonJS({
  "node_modules/slack-edge/dist/request/payload/view-closed.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/request/payload/view-objects.js
var require_view_objects = __commonJS({
  "node_modules/slack-edge/dist/request/payload/view-objects.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/response/response-body.js
var require_response_body = __commonJS({
  "node_modules/slack-edge/dist/response/response-body.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/slack-edge/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/slack-edge/dist/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_app(), exports);
    __exportStar(require_app_env(), exports);
    __exportStar(require_execution_context(), exports);
    __exportStar(require_dist(), exports);
    __exportStar(require_assistant(), exports);
    __exportStar(require_thread_context(), exports);
    __exportStar(require_thread_context_store(), exports);
    __exportStar(require_errors2(), exports);
    __exportStar(require_error_codes(), exports);
    __exportStar(require_handler(), exports);
    __exportStar(require_message_handler(), exports);
    __exportStar(require_options_handler(), exports);
    __exportStar(require_view_handler(), exports);
    __exportStar(require_authorize(), exports);
    __exportStar(require_authorize_error_handler(), exports);
    __exportStar(require_authorize_result(), exports);
    __exportStar(require_single_team_authorize(), exports);
    __exportStar(require_middleware(), exports);
    __exportStar(require_built_in_middleware(), exports);
    __exportStar(require_context(), exports);
    __exportStar(require_oauth_app(), exports);
    __exportStar(require_authorize_url_generator(), exports);
    __exportStar(require_hook(), exports);
    __exportStar(require_escape_html(), exports);
    __exportStar(require_installation(), exports);
    __exportStar(require_installation_store(), exports);
    __exportStar(require_oauth_page_renderer(), exports);
    __exportStar(require_state_store(), exports);
    __exportStar(require_authorize_url_generator2(), exports);
    __exportStar(require_hook2(), exports);
    __exportStar(require_login(), exports);
    __exportStar(require_request_body(), exports);
    __exportStar(require_request_verification(), exports);
    __exportStar(require_request2(), exports);
    __exportStar(require_payload_types(), exports);
    __exportStar(require_block_action(), exports);
    __exportStar(require_block_suggestion(), exports);
    __exportStar(require_event(), exports);
    __exportStar(require_global_shortcut(), exports);
    __exportStar(require_message_shortcut(), exports);
    __exportStar(require_slash_command(), exports);
    __exportStar(require_view_submission(), exports);
    __exportStar(require_view_closed(), exports);
    __exportStar(require_view_objects(), exports);
    __exportStar(require_response(), exports);
    __exportStar(require_response_body(), exports);
    __exportStar(require_socket_mode_client(), exports);
    __exportStar(require_payload_handler(), exports);
    __exportStar(require_message_events(), exports);
  }
});

// node_modules/slack-cloudflare-workers/dist/kv-installation-store.js
var require_kv_installation_store = __commonJS({
  "node_modules/slack-cloudflare-workers/dist/kv-installation-store.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _KVInstallationStore_env;
    var _KVInstallationStore_storage;
    var _KVInstallationStore_tokenRotator;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KVInstallationStore = void 0;
    exports.toBotInstallationQuery = toBotInstallationQuery;
    exports.toUserInstallationQuery = toUserInstallationQuery;
    exports.toBotInstallationKey = toBotInstallationKey;
    exports.toUserInstallationKey = toUserInstallationKey;
    var slack_edge_1 = require_dist2();
    var KVInstallationStore = class {
      constructor(env, namespace) {
        _KVInstallationStore_env.set(this, void 0);
        _KVInstallationStore_storage.set(this, void 0);
        _KVInstallationStore_tokenRotator.set(this, void 0);
        __classPrivateFieldSet(this, _KVInstallationStore_env, env, "f");
        __classPrivateFieldSet(this, _KVInstallationStore_storage, namespace, "f");
        __classPrivateFieldSet(this, _KVInstallationStore_tokenRotator, new slack_edge_1.TokenRotator({
          clientId: env.SLACK_CLIENT_ID,
          clientSecret: env.SLACK_CLIENT_SECRET
        }), "f");
      }
      async save(installation, request = void 0) {
        await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").put(toBotInstallationKey(__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID, installation), JSON.stringify(installation));
        await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").put(toUserInstallationKey(__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID, installation), JSON.stringify(installation));
      }
      async findBotInstallation(query) {
        const storedString = await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").get(toBotInstallationQuery(__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID, query));
        if (storedString) {
          return JSON.parse(storedString);
        }
        return void 0;
      }
      async findUserInstallation(query) {
        const storedString = await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").get(toUserInstallationQuery(__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID, query));
        if (storedString) {
          return JSON.parse(storedString);
        }
        return void 0;
      }
      async deleteBotInstallation(query) {
        await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").delete(toBotInstallationQuery(__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID, query));
      }
      async deleteUserInstallation(query) {
        await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").delete(toUserInstallationQuery(__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID, query));
      }
      async deleteAll(query) {
        const clientId = __classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_CLIENT_ID;
        if (!query.enterpriseId && !query.teamId) {
          return;
        }
        const e = query.enterpriseId ? query.enterpriseId : "_";
        const prefix = query.teamId ? `${clientId}/${e}:${query.teamId}` : `${clientId}/${e}:`;
        var keys = [];
        const first = await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").list({ prefix });
        keys = keys.concat(first.keys.map((k) => k.name));
        if (!first.list_complete) {
          var cursor = first.cursor;
          while (cursor) {
            const response = await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").list({ prefix, cursor });
            keys = keys.concat(response.keys.map((k) => k.name));
            cursor = response.list_complete ? void 0 : response.cursor;
          }
        }
        for (const key of keys) {
          await __classPrivateFieldGet(this, _KVInstallationStore_storage, "f").delete(key);
        }
      }
      toAuthorize() {
        return async (req) => {
          const query = {
            isEnterpriseInstall: req.context.isEnterpriseInstall,
            enterpriseId: req.context.enterpriseId,
            teamId: req.context.teamId,
            userId: req.context.userId
          };
          try {
            const bot = await this.findBotInstallation(query);
            if (bot && bot.bot_refresh_token) {
              const maybeRefreshed = await __classPrivateFieldGet(this, _KVInstallationStore_tokenRotator, "f").performRotation({
                bot: {
                  access_token: bot.bot_token,
                  refresh_token: bot.bot_refresh_token,
                  token_expires_at: bot.bot_token_expires_at
                }
              });
              if (maybeRefreshed && maybeRefreshed.bot) {
                bot.bot_token = maybeRefreshed.bot.access_token;
                bot.bot_refresh_token = maybeRefreshed.bot.refresh_token;
                bot.bot_token_expires_at = maybeRefreshed.bot.token_expires_at;
                await this.save(bot);
              }
            }
            const botClient = new slack_edge_1.SlackAPIClient(bot?.bot_token, {
              logLevel: __classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_LOGGING_LEVEL
            });
            const botAuthTest = await botClient.auth.test();
            const botScopes = botAuthTest.headers.get("x-oauth-scopes")?.split(",") ?? bot?.bot_scopes ?? [];
            const userQuery = {};
            Object.assign(userQuery, query);
            if (__classPrivateFieldGet(this, _KVInstallationStore_env, "f").SLACK_USER_TOKEN_RESOLUTION !== "installer") {
              userQuery.enterpriseId = req.context.actorEnterpriseId;
              userQuery.teamId = req.context.actorTeamId;
              userQuery.userId = req.context.actorUserId;
            }
            const user = await this.findUserInstallation(query);
            if (user && user.user_refresh_token) {
              const maybeRefreshed = await __classPrivateFieldGet(this, _KVInstallationStore_tokenRotator, "f").performRotation({
                user: {
                  access_token: user.user_token,
                  refresh_token: user.user_refresh_token,
                  token_expires_at: user.user_token_expires_at
                }
              });
              if (maybeRefreshed && maybeRefreshed.user) {
                user.user_token = maybeRefreshed.user.access_token;
                user.user_refresh_token = maybeRefreshed.user.refresh_token;
                user.user_token_expires_at = maybeRefreshed.user.token_expires_at;
                await this.save(user);
              }
            }
            let userAuthTest = void 0;
            if (user) {
              userAuthTest = await botClient.auth.test({ token: user.user_token });
            }
            return {
              enterpriseId: bot?.enterprise_id,
              teamId: bot?.team_id,
              team: botAuthTest.team,
              url: botAuthTest.url,
              botId: botAuthTest.bot_id,
              botUserId: botAuthTest.user_id,
              botToken: bot?.bot_token,
              botScopes,
              userId: user ? user.user_id : void 0,
              user: userAuthTest?.user,
              userToken: user?.user_token,
              userScopes: user?.user_scopes
            };
          } catch (e) {
            throw new slack_edge_1.AuthorizeError(`Failed to authorize (error: ${e}, query: ${JSON.stringify(query)})`);
          }
        };
      }
    };
    __name(KVInstallationStore, "KVInstallationStore");
    exports.KVInstallationStore = KVInstallationStore;
    _KVInstallationStore_env = /* @__PURE__ */ new WeakMap(), _KVInstallationStore_storage = /* @__PURE__ */ new WeakMap(), _KVInstallationStore_tokenRotator = /* @__PURE__ */ new WeakMap();
    function toBotInstallationQuery(clientId, q) {
      const e = q.enterpriseId ? q.enterpriseId : "_";
      const t = q.teamId && !q.isEnterpriseInstall ? q.teamId : "_";
      return `${clientId}/${e}:${t}`;
    }
    __name(toBotInstallationQuery, "toBotInstallationQuery");
    function toUserInstallationQuery(clientId, q) {
      const e = q.enterpriseId ? q.enterpriseId : "_";
      const t = q.teamId && !q.isEnterpriseInstall ? q.teamId : "_";
      const u = q.userId ? q.userId : "_";
      return `${clientId}/${e}:${t}:${u}`;
    }
    __name(toUserInstallationQuery, "toUserInstallationQuery");
    function toBotInstallationKey(clientId, installation) {
      const e = installation.enterprise_id ?? "_";
      const t = installation.team_id && !installation.is_enterprise_install ? installation.team_id : "_";
      return `${clientId}/${e}:${t}`;
    }
    __name(toBotInstallationKey, "toBotInstallationKey");
    function toUserInstallationKey(clientId, installation) {
      const e = installation.enterprise_id ?? "_";
      const t = installation.team_id && !installation.is_enterprise_install ? installation.team_id : "_";
      const u = installation.user_id ?? "_";
      return `${clientId}/${e}:${t}:${u}`;
    }
    __name(toUserInstallationKey, "toUserInstallationKey");
  }
});

// node_modules/slack-cloudflare-workers/dist/kv-state-store.js
var require_kv_state_store = __commonJS({
  "node_modules/slack-cloudflare-workers/dist/kv-state-store.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _KVStateStore_storage;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KVStateStore = void 0;
    var KVStateStore = class {
      constructor(namespace) {
        _KVStateStore_storage.set(this, void 0);
        __classPrivateFieldSet(this, _KVStateStore_storage, namespace, "f");
      }
      async issueNewState() {
        const state = crypto.randomUUID();
        await __classPrivateFieldGet(this, _KVStateStore_storage, "f").put(state, "valid", { expirationTtl: 300 });
        return state;
      }
      async consume(state) {
        const found = await __classPrivateFieldGet(this, _KVStateStore_storage, "f").get(state);
        if (found === "valid") {
          await __classPrivateFieldGet(this, _KVStateStore_storage, "f").delete(state);
          return true;
        }
        return false;
      }
    };
    __name(KVStateStore, "KVStateStore");
    exports.KVStateStore = KVStateStore;
    _KVStateStore_storage = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/slack-cloudflare-workers/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/slack-cloudflare-workers/dist/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_dist2(), exports);
    __exportStar(require_kv_installation_store(), exports);
    __exportStar(require_kv_state_store(), exports);
  }
});

// .wrangler/tmp/bundle-0dvhAc/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-0dvhAc/middleware-insertion-facade.js
init_modules_watch_stub();

// src/index.ts
init_modules_watch_stub();
var import_slack_cloudflare_workers = __toESM(require_dist3());
var src_default = {
  async fetch(request, env, ctx) {
    const app = new import_slack_cloudflare_workers.SlackApp({ env });
    app.command(
      "/hey-cf-workers",
      // "ack" 関数は 3 秒以内に完了する必要があります
      async (_req) => {
        return "What's up?";
      },
      // "lazy" 関数では 3 秒の制約はなく、非同期で実行したい処理を何でもできます
      async (req) => {
        await req.context.respond({
          text: "Hey! This is an async response!"
        });
      }
    );
    return await app.run(request, ctx);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-0dvhAc/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-0dvhAc/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

slack-edge/dist/cookie.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=index.js.map
