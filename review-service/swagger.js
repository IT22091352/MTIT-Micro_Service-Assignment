const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Review Service API",
    version: "1.0.0",
    description: "CRUD API for managing course reviews"
  },
  servers: [
    {
      url: "http://localhost:3006"
    },
    {
      url: "http://localhost:3000/api"
    }
  ],
  components: {
    schemas: {
      Review: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 2 },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comment: { type: "string", example: "Great course" }
        }
      },
      ReviewInput: {
        type: "object",
        required: ["userId", "courseId", "rating", "comment"],
        properties: {
          userId: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 2 },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
          comment: { type: "string", example: "Very helpful" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "review not found" }
        }
      }
    }
  },
  paths: {
    "/reviews": {
      post: {
        summary: "Create review",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ReviewInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Review created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Review"
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
        summary: "Get all reviews",
        responses: {
          "200": {
            description: "List of reviews",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Review"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/reviews/{id}": {
      get: {
        summary: "Get review by ID",
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
            description: "Review found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Review"
                }
              }
            }
          },
          "404": {
            description: "Review not found",
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
        summary: "Update review by ID",
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
                $ref: "#/components/schemas/ReviewInput"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Review updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Review"
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
            description: "Review not found",
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
        summary: "Delete review by ID",
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
            description: "Review deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "review deleted successfully" },
                    review: { $ref: "#/components/schemas/Review" }
                  }
                }
              }
            }
          },
          "404": {
            description: "Review not found",
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
