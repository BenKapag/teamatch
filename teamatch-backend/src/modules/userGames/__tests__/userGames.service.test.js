const userGamesService = require("../userGames.service");
const userGamesRepository = require("../userGames.repository");

// Tell Jest to mock the entire repository module
jest.mock("../userGames.repository");

describe("userGamesService", () => {

  // Reset mocks before each test so they don't bleed into each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteCurrentUsersGame", () => {

  it("should return the deleted game when it exists", async () => {
    // 1. Arrange — set up the mock to return a fake row
    userGamesRepository.deleteCurrentUsersGame.mockResolvedValue({
      id: 1,
      user_id: 1,
      game_id: 1,
      rank: "Gold",
      is_main: false,
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z",
    });


    // 2. Act — call the service
    const result = await userGamesService.deleteCurrentUsersGame({
      userId: 1,
      gameId: 1,
    });

    // 3. Assert — check the result
    expect(result).toEqual({
      id: 1,
      userId: 1,
      gameId: 1,
      rank: "Gold",
      isMain: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("should throw GAME_NOT_FOUND when the game does not exist", async () => {
  // 1. Arrange — mock returns null, simulating no row found
  userGamesRepository.deleteCurrentUsersGame.mockResolvedValue(null);

  // 2. Act & Assert — expect the service to throw
  const error = await userGamesService
    .deleteCurrentUsersGame({ userId: 1, gameId: 999 })
    .catch((e) => e);

  expect(error.code).toBe("GAME_NOT_FOUND");
  });

 });

 describe("updateCurrentUsersGame", () => {
  it("should return the updated user game when it exists and updated", async () => {
    // Arrange
    userGamesRepository.updateCurrentUserGame.mockResolvedValue({
      id: 1,
      user_id: 1,
      game_id: 1,
      rank: "Gold",
      is_main: true,
      created_at: "2026-06-09 16:08:30.5703",
      updated_at: "2026-06-09 16:12:45.71312",
    });

    // Act
    const result = await userGamesService.updateCurrentUserGame({
      userId: 1,
      gameId: 1,
      userGameData: {
        rank: "Gold",
        isMain: true,
      }
    });

    // Assert
    expect(result).toEqual({
      id: 1, 
      userId: 1,
      gameId: 1,
      rank: "Gold",
      isMain: true,
      createdAt: "2026-06-09 16:08:30.5703",
      updatedAt: "2026-06-09 16:12:45.71312",
    });
  });

  it("should throw GAME_NOT_FOUND when the game does not exist", async () => {
    // Arrange
    userGamesRepository.updateCurrentUserGame.mockResolvedValue(null);

    // Act
    const error = await userGamesService.updateCurrentUserGame({
      userId: 1,
      gameId: 999,
      userGameData: {
        rank: "Gold",
        isMain: true,
      },
    }).catch((e) => e);

    // Assert
    expect(error.code).toBe("GAME_NOT_FOUND");
  });

 });

});