var AWS = require('aws-sdk');

var client;

var ElasticsearchDomain = AWS.Service.defineService('elasticsearchdomain', {});
    ElasticsearchDomain = AWS.Service.defineServiceApi(ElasticsearchDomain, {
      metadata: {
        signatureVersion: 'v4',
        protocol: 'rest-json',
        serviceFullName: 'Amazon Elasticsearch Domain Service',
        signingName: 'es'
      },
      operations: {
        "bulkInsert": {
          name: "bulkInsert",
          http: {
            method: "POST",
            requestUri: "/{Index}/_bulk"
          },
          input: {
            "type": "structure",
            "required": ["Index"],
            "members": {
              "Index": {
                "location": "uri",
                "locationName": "Index"
              },
              "ContentType": {
                "location": "header",
                "locationName": "Content-Type"
              },
              "Body": {
                "type": "blob",
                "streaming": true
              }
            },
            "payload": "Body"
          },
          output: {
            "type": "string"
          }
        },
      }
    });


exports.bulkInsert = function(index, data) {
  client.bulkInsert({"Index": index, "Body": data, "ContentType": "application/json"}, function(err, data) {
    if (err) {
      lg.log('error', err.text);
    }
  });
};

exports.init = function(configEs, logger) {
  var endpoint;

  lg = logger;
  elasticHost = configEs.host || 'localhost';
  elasticPath = configEs.path || '/';

  awsConfig = configEs.aws || {};
  awsConfig.region = awsConfig.region || 'us-west-2';
  AWS.config.update(awsConfig)

  endpoint = new AWS.Endpoint(elasticHost, {sslEnabled: false})
  client = new ElasticsearchDomain({endpoint: endpoint, paramValidation: false})
};
