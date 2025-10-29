require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const port = process.env.PORT || 8080;

const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "EduFunds backend api",
  },
  servers: [
    { url: `http://localhost:${port}`, description: "Local server" },
    {
      url: "https://edufund-backend-os2x.onrender.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Authorization header using the Bearer scheme.",
      },
    },
    schemas: {
      User: {
        $email: "user@example.com",
        $password: "strongPassword123",
        firstName: "John",
        lastName: "Doe",
        profilePicture: {
          imageUrl: "https://example.com/avatar.jpg",
          publicId: "profile_public_id",
        },
        phoneNumber: "+2348012345678",
        isVerified: false,
        role: "student",
        sponsorType: "individual",
        organizationName: "Example Org",
      },

      Academic: {
        $studentId: "64d3f6a9e4b0f2a1d9c0b123",
        $schoolName: "Example University",
        $year: 2024,
        $matricNumber: 12345678,
        $jambRegistrationNumber: 87654321,
      },

      Campaign: {
        $studentId: "64d3f6a9e4b0f2a1d9c0b123",
        $title: "Help fund my tuition",
        $target: 500000,
        $story: "A short description of the student's need and campaign goals.",
        isActive: true,
        campaignImage: { imageUrl: "https://example.com/campaign.jpg" },
        publicId: "campaign_public_id",
      },

      Otp: {
        $userId: "64d3f6a9e4b0f2a1d9c0b123",
        $otp: "123456",
        trials: 0,
        blockedUntil: null,
      },

      Payment: {
        campaignId: "64d3f6a9e4b0f2a1d9c0b999",
        $senderId: "64d3f6a9e4b0f2a1d9c0b111",
        $receiverId: "64d3f6a9e4b0f2a1d9c0b222",
        withdrawalId: null,
        $amount: 2500,
        $reference: "pay_ref_123456",
        status: "pending",
        withdrawn: false,
      },

      UserIdentity: {
        $userId: "64d3f6a9e4b0f2a1d9c0b123",
        $provider: "google",
        providerId: "google-oauth-id-123",
        accessToken: "ya29.a0Af...",
        refreshToken: "1//0g...",
      },

      VerificationToken: {
        $userId: "64d3f6a9e4b0f2a1d9c0b123",
        $token: "verification-token-abcdef",
        expiresAt: "2025-10-28T12:00:00Z",
      },

      Wallet: {
        userId: "64d3f6a9e4b0f2a1d9c0b123",
        balance: 0,
      },

      Withdrawal: {
        $userId: "64d3f6a9e4b0f2a1d9c0b123",
        $campaignId: "64d3f6a9e4b0f2a1d9c0b999",
        $transactionRef: "wd_ref_98765",
        $amount: 1500.5,
        $purpose: "Tuition payout",
        note: "Optional note",
        status: "processing",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json", "multipart/form-data"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
