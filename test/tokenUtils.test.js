// Import necessary modules
import jwt from "jsonwebtoken";
import verifyToken from "./../src/controlers/auth/verifyToken";

// Mock the environment variable for JSON_WEB_TOKEN
process.env.JSON_WEB_TOKEN = "mocked-secret";

// Mock Express request and response objects
const mockRequest = (token) => ({
  headers: {
    authorization: token ? `Bearer ${token}` : undefined,
  },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Describe the tests
describe("Verify Token Middleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if token is provided and valid", () => {
    const user = {
      userId: 1,
      firstName: "Joe",
      lastName: "Doe",
      email: "test@example.com",
    };
    const token = jwt.sign(user, process.env.JSON_WEB_TOKEN, {
      expiresIn: "1h",
    });

    const req = mockRequest(token);
    const res = mockResponse();

    verifyToken(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toEqual(user.userId);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 401 error if no token is provided", () => {
    const req = mockRequest(undefined);
    const res = mockResponse();

    verifyToken(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Access denied. No token provided.",
    });
  });

  it("should return 500 error if token is invalid", () => {
    const invalidToken = "invalid-token";

    const req = mockRequest(invalidToken);
    const res = mockResponse();

    verifyToken(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(String), // Asserting that the response contains an error message
    });
  });
});
