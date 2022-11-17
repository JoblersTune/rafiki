/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    /** Make a new grant request */
    post: operations["post-request"];
    parameters: {};
  };
  "/continue/{id}": {
    /** Continue a grant request during or after user interaction. */
    post: operations["post-continue"];
    /** Cancel a grant request or delete a grant client side. */
    delete: operations["delete-continue"];
    parameters: {
      path: {
        id: string;
      };
    };
  };
  "/token/{id}": {
    /** Management endpoint to rotate access token. */
    post: operations["post-token"];
    /** Management endpoint to revoke access token. */
    delete: operations["delete-token"];
    parameters: {
      path: {
        id: string;
      };
    };
  };
}

export interface components {
  schemas: {
    /**
     * client
     * @description Describes the client instance that is making this request, including the key that the client instance will use to protect this request and any continuation requests at the AS and any user-facing information about the client instance used in interactions.
     *
     * When sending a non-continuation request to the AS, the client instance MUST identify itself by including the client field of the request and by signing the request.
     */
    client: {
      /** @description An object containing additional information that the AS MAY display to the RO during interaction, authorization, and management. */
      display?: {
        name?: string;
        /** Format: uri */
        uri?: string;
      };
      /** @description An identifier string that the AS can use to identify the client software comprising this client instance. */
      client_id?: string;
      /** @description The public key of the client instance to be used in this request or a reference to a key. */
      key?:
        | external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["key"]
        | string;
    };
    /**
     * interact
     * @description The client instance declares the parameters for interaction methods that it can support using the interact field.
     */
    "interact-request": {
      /** @description Indicates how the client instance can start an interaction. */
      start: "redirect"[];
      /** @description Indicates how the client instance can receive an indication that interaction has finished at the AS. */
      finish?: {
        /** @description The callback method that the AS will use to contact the client instance. */
        method: "redirect";
        /**
         * Format: uri
         * @description Indicates the URI that the AS will either send the RO to after interaction or send an HTTP POST request.
         */
        uri: string;
        /** @description Unique value to be used in the calculation of the "hash" query parameter sent to the callback URI, must be sufficiently random to be unguessable by an attacker.  MUST be generated by the client instance as a unique value for this request. */
        nonce: string;
      };
    };
    /** interact-response */
    "interact-response": {
      /**
       * Format: uri
       * @description The URI to direct the end user to.
       */
      redirect: string;
      /** @description Unique key to secure the callback. */
      finish: string;
    };
    /**
     * continue
     * @description If the AS determines that the request can be continued with additional requests, it responds with the continue field.
     */
    continue: {
      /** @description A unique access token for continuing the request, called the "continuation access token". */
      access_token: {
        value: string;
      };
      /**
       * Format: uri
       * @description The URI at which the client instance can make continuation requests.
       */
      uri: string;
      /** @description The amount of time in integer seconds the client instance MUST wait after receiving this request continuation response and calling the continuation URI. */
      wait?: number;
    };
    /**
     * access_token
     * @description A single access token or set of access tokens that the client instance can use to call the RS on behalf of the RO.
     */
    access_token: {
      /** @description The value of the access token as a string.  The value is opaque to the client instance.  The value SHOULD be limited to ASCII characters to facilitate transmission over HTTP headers within other protocols without requiring additional encoding. */
      value: string;
      /**
       * Format: uri
       * @description The management URI for this access token. This URI MUST NOT include the access token value and SHOULD be different for each access token issued in a request.
       */
      manage: string;
      /** @description The number of seconds in which the access will expire.  The client instance MUST NOT use the access token past this time.  An RS MUST NOT accept an access token past this time. */
      expires_in?: number;
      access: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["access"];
    };
  };
}

export interface operations {
  /** Make a new grant request */
  "post-request": {
    parameters: {};
    responses: {
      /** OK */
      200: {
        content: {
          "application/json":
            | {
                interact: components["schemas"]["interact-response"];
                continue: components["schemas"]["continue"];
              }
            | {
                access_token: components["schemas"]["access_token"];
                continue: components["schemas"]["continue"];
              };
        };
      };
      /** Bad Request */
      400: unknown;
    };
    requestBody: {
      content: {
        "application/json": {
          access_token: {
            access: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["access"];
          };
          client: components["schemas"]["client"];
          interact?: components["schemas"]["interact-request"];
        };
      };
    };
  };
  /** Continue a grant request during or after user interaction. */
  "post-continue": {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** Success */
      200: {
        content: {
          "application/json": {
            access_token?: components["schemas"]["access_token"];
            continue: components["schemas"]["continue"];
          };
        };
      };
      /** Unauthorized */
      401: unknown;
      /** Not Found */
      404: unknown;
    };
    requestBody: {
      content: {
        "application/json": {
          /**
           * @description The interaction reference generated for this
           * interaction by the AS.
           */
          interact_ref: string;
        };
      };
    };
  };
  /** Cancel a grant request or delete a grant client side. */
  "delete-continue": {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** Accepted */
      202: unknown;
      /** Unauthorized */
      401: unknown;
      /** Not Found */
      404: unknown;
    };
  };
  /** Management endpoint to rotate access token. */
  "post-token": {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": {
            access_token: components["schemas"]["access_token"];
          };
        };
      };
      /** Unauthorized */
      401: unknown;
      /** Not Found */
      404: unknown;
    };
  };
  /** Management endpoint to revoke access token. */
  "delete-token": {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** No Content */
      204: never;
      /** Unauthorized */
      401: unknown;
    };
  };
}

export interface external {
  "https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml": {
    paths: {};
    components: {
      schemas: {
        /** @description A description of the rights associated with this access token. */
        access: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["access-item"][];
        /** @description The access associated with the access token is described using objects that each contain multiple dimensions of access. */
        "access-item":
          | external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["access-incoming"]
          | external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["access-outgoing"]
          | external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["access-quote"];
        /** access-incoming */
        "access-incoming": {
          /** @description The type of resource request as a string.  This field defines which other fields are allowed in the request object. */
          type: "incoming-payment";
          /** @description The types of actions the client instance will take at the RS as an array of strings. */
          actions: (
            | "create"
            | "complete"
            | "read"
            | "read-all"
            | "list"
            | "list-all"
          )[];
          /**
           * Format: uri
           * @description A string identifier indicating a specific resource at the RS.
           */
          identifier?: string;
        };
        /** access-outgoing */
        "access-outgoing": {
          /** @description The type of resource request as a string.  This field defines which other fields are allowed in the request object. */
          type: "outgoing-payment";
          /** @description The types of actions the client instance will take at the RS as an array of strings. */
          actions: ("create" | "read" | "read-all" | "list" | "list-all")[];
          /**
           * Format: uri
           * @description A string identifier indicating a specific resource at the RS.
           */
          identifier: string;
          limits?: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["limits-outgoing"];
        };
        /** access-quote */
        "access-quote": {
          /** @description The type of resource request as a string.  This field defines which other fields are allowed in the request object. */
          type: "quote";
          /** @description The types of actions the client instance will take at the RS as an array of strings. */
          actions: ("create" | "read" | "read-all")[];
        };
        /**
         * amount
         * @description All amounts are maxima, i.e. multiple payments can be created under a grant as long as the total amounts of these payments do not exceed the maximum amount per interval as specified in the grant.
         */
        amount: {
          /**
           * Format: uint64
           * @description The value is an unsigned 64-bit integer amount, represented as a string.
           */
          value: string;
          assetCode: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["assetCode"];
          assetScale: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["assetScale"];
        };
        /**
         * Asset code
         * @description The assetCode is a code that indicates the underlying asset. This SHOULD be an ISO4217 currency code.
         */
        assetCode: string;
        /**
         * Asset scale
         * @description The scale of amounts denoted in the corresponding asset code.
         */
        assetScale: number;
        /**
         * Interval
         * @description [ISO8601 repeating interval](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals)
         */
        interval: string;
        /**
         * key
         * @description A key presented by value MUST be a public key.
         */
        key: {
          /** @description The form of proof that the client instance will use when presenting the key. */
          proof: "httpsig";
          /** @description The public key and its properties represented as a JSON Web Key [[RFC7517](https://datatracker.ietf.org/doc/html/rfc7517)]. */
          jwk: {
            /** @description The cryptographic algorithm family used with the key. The only allowed value is `EdDSA`. */
            alg: "EdDSA";
            /** @description A Key ID can be used to match a specific key. */
            kid: string;
            /** @description The Key Type. The only allowed value is `OKP`. */
            kty: "OKP";
            /** @description The intended use of the key. */
            use?: "sig";
            /** @description The cryptographic curve used with the key. The only allowed value is `Ed25519`. */
            crv: "Ed25519";
            /** @description Public key encoded using the `base64url` encoding. */
            x: string;
            /** @description Array of allowed operations this key may be used for. */
            key_ops?: ("sign" | "verify")[];
            /** @description UNIX timestamp indicating the earliest this key may be used. */
            nbf?: number;
            /** @description UNIX timestamp indicating the latest this key may be used. */
            exp?: number;
            /** @description The revocation status of the key. */
            revoked?: boolean;
          };
        };
        /**
         * limits-outgoing
         * @description Open Payments specific property that defines the limits under which outgoing payments can be created.
         */
        "limits-outgoing": Partial<unknown> & {
          receiver?: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["receiver"];
          sendAmount?: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["amount"];
          receiveAmount?: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["amount"];
          interval?: external["https://raw.githubusercontent.com/interledger/open-payments/0523804eeb21d9b8cd2eb65e4119738a0512a095/openapi/schemas.yaml"]["components"]["schemas"]["interval"];
        };
        "list-actions": "list" | "list-all";
        "read-actions": "read" | "read-all";
        /**
         * Receiver
         * Format: uri
         * @description The URL of the incoming payment or ILP STREAM connection that is being paid.
         */
        receiver: string;
      };
    };
    operations: {};
  };
}