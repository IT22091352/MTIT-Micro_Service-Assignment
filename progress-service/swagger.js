const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Progress Service API",
    version: "1.0.0",
    description: "CRUD API for managing learning progress"
  },
  servers: [
    {
      url: "http://localhost:3005"
    }
  ],
  components: {
    schemas: {
      Progress: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 2 },
          completionPercentage: { type: "number", minimum: 0, maximum: 100, example: 75 }
        }
      },
      ProgressInput: {
        type: "object",
        required: ["userId", "courseId", "completionPercentage"],
        properties: {
          userId: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 2 },
          completionPercentage: { type: "number", minimum: 0, maximum: 100, example: 60 }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "progress not found" }
        }
      }
    }
  },
  paths: {
    "/progress": {
      post: {
        summary: "Create progress",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProgressInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Progress created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Progress"
                }
              }
            }
          },
          "400": {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      get: {
        summary: "Get all progress",
        responses: {
          "200": {
            description: "List of progress records",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Progress"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/progress/{id}": {
      get: {
        summary: "Get progress by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Progress found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Progress"
                }
              }
            }
          },
          "400": {
            description: "Invalid ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "404": {
            description: "Progress not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      put: {
        summary: "Update progress by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProgressInput"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Progress updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Progress"
                }
              }
            }
          },
          "400": {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "404": {
            description: "Progress not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      delete: {
        summary: "Delete progress by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Progress deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "progress deleted successfully" },
                    progress: { $ref: "#/components/schemas/Progress" }
                  }
                }
              }
            }
          },
          "400": {
            description: "Invalid ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "404": {
            description: "Progress not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
