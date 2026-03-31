const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Enrollment Service API",
    version: "1.0.0",
    description: "CRUD API for managing enrollments"
  },
  servers: [
    {
      url: "http://localhost:3003"
    }
  ],
  components: {
    schemas: {
      Enrollment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 2 }
        }
      },
      EnrollmentInput: {
        type: "object",
        required: ["userId", "courseId"],
        properties: {
          userId: { type: "integer", example: 1 },
          courseId: { type: "integer", example: 2 }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "enrollment not found" }
        }
      }
    }
  },
  paths: {
    "/enrollments": {
      post: {
        summary: "Create enrollment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EnrollmentInput"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Enrollment created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Enrollment"
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
        summary: "Get all enrollments",
        responses: {
          "200": {
            description: "List of enrollments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Enrollment"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/enrollments/{id}": {
      get: {
        summary: "Get enrollment by ID",
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
            description: "Enrollment found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Enrollment"
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
            description: "Enrollment not found",
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
        summary: "Update enrollment by ID",
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
                $ref: "#/components/schemas/EnrollmentInput"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Enrollment updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Enrollment"
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
            description: "Enrollment not found",
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
        summary: "Delete enrollment by ID",
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
            description: "Enrollment deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "enrollment deleted successfully" },
                    enrollment: { $ref: "#/components/schemas/Enrollment" }
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
            description: "Enrollment not found",
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
