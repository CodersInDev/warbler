var config = {
      database: "./warbleDB",
      validator: {
        timestamp: {required: true},
        content: {required: true},
        user: {required: true}    
      }
  };
module.exports = config;
