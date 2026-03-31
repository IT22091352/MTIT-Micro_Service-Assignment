const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Content Service API",
    version: "1.0.0",
    description: "CRUD API for managing learning content"
  },
  servers: [
    {
      url: "http://localhost:3004"
    }
  ],
  components: {
    schemas: {
      Content: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 1 },
          type: { type: "string", enum: ["video", "pdf"], example: "video" },
          url: { type: "string", example: "https://example.com/video1" }
        }
      },
      ContentInput: {
        type: "object",
        required: ["courseId", "type", "url"],
        properties: {
          courseId: { type: "integer", example: 1 },
          type: { type: "string", enum: ["video", "pdf"], example: "pdf" },
          url: { type: "string", example: "https://example.com/doc1.pdf" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "content not found" }
        }
      }
    }
  },
  paths: {
    "/contents": {
      post: {
        summary: "Create content",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ContentInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Content created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Content"
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
        summary: "Get all content",
        responses: {
          "200": {
            description: "List of content",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Content"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/contents/{id}": {
      get: {
        summary: "Get content by ID",
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
            description: "Content found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Content"
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
            description: "Content not found",
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
        summary: "Update content by ID",
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
                $ref: "#/components/schemas/ContentInput"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Content updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Content"
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
            description: "Content not found",
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
        summary: "Delete content by ID",
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
            description: "Content deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "content deleted successfully" },
                    content: { $ref: "#/components/schemas/Content" }
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
            description: "Content not found",
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
