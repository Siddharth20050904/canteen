"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateLikes(suggestionId: number, userId: string) {
  try {
    // Check if the user has already liked the suggestion
    const existingLike = await prisma.suggestion.findFirst({
      where: {
        id: suggestionId,
        likedBy: {
          some: {
            id: userId
          }
        }
      }
    });

    if (existingLike) {
      return { success: false, message: "User has already liked this suggestion" };
    }

    // Check if the user has already disliked the suggestion
    const existingDislike = await prisma.suggestion.findFirst({
      where: {
        id: suggestionId,
        dislikedBy: {
          some: {
            id: userId
          }
        }
      }
    });

    // Increment likes, connect user to likedBy, and decrement dislikes if necessary
    const suggestion = await prisma.suggestion.update({
      where: {
        id: suggestionId
      },
      data: {
        likes: {
          increment: 1
        },
        likedBy: {
          connect: {
            id: userId
          }
        },
        ...(existingDislike && {
          dislikes: {
            decrement: 1
          },
          dislikedBy: {
            disconnect: {
              id: userId
            }
          }
        })
      }
    });

    console.log(suggestion);
    return { success: true, message: "Likes updated successfully" };
  } catch (error) {
    console.error("Error updating likes:", error);
    return { success: false, message: "Error updating likes" };
  }
}

export async function updateDislikes(suggestionId: number, userId: string) {
  try {
    // Check if the user has already disliked the suggestion
    const existingDislike = await prisma.suggestion.findFirst({
      where: {
        id: suggestionId,
        dislikedBy: {
          some: {
            id: userId
          }
        }
      }
    });

    if (existingDislike) {
      return { success: false, message: "User has already disliked this suggestion" };
    }

    // Check if the user has already liked the suggestion
    const existingLike = await prisma.suggestion.findFirst({
      where: {
        id: suggestionId,
        likedBy: {
          some: {
            id: userId
          }
        }
      }
    });

    // Increment dislikes, connect user to dislikedBy, and decrement likes if necessary
    const suggestion = await prisma.suggestion.update({
      where: {
        id: suggestionId
      },
      data: {
        dislikes: {
          increment: 1
        },
        dislikedBy: {
          connect: {
            id: userId
          }
        },
        ...(existingLike && {
          likes: {
            decrement: 1
          },
          likedBy: {
            disconnect: {
              id: userId
            }
          }
        })
      }
    });

    console.log(suggestion);
    return { success: true, message: "Dislikes updated successfully" };
  } catch (error) {
    console.error("Error updating dislikes:", error);
    return { success: false, message: "Error updating dislikes" };
  }
}

export async function getNumberOfLikes(suggestionId: number) {
  console.log("suggestionId:", suggestionId);
  try {
    const suggestion = await prisma.suggestion.findUnique({
      where: {
        id: suggestionId
      }
    });
    return suggestion?.likes;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return null;
  }
}

export async function getNumberOfDislikes(suggestionId: number) {
  try {
    const suggestion = await prisma.suggestion.findUnique({
      where: {
        id: suggestionId
      }
    });
    return suggestion?.dislikes;
  } catch (error) {
    console.error("Error fetching dislikes:", error);
    return null;
  }
}

export async function getLikesByUserId(userId: string) {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: {
        likedBy: {
          some: {
            id: userId
          }
        }
      }
    });
    return suggestions;
  }
  catch (error) {
    console.error("Error fetching liked suggestions:", error);
    return null;
  }
}

export async function getDislikesByUserId(userId: string) {
  try {
    const suggestions = await prisma.suggestion.findMany({
      where: {
        dislikedBy: {
          some: {
            id: userId
          }
        }
      }
    });
    return suggestions;
  }
  catch (error) {
    console.error("Error fetching liked suggestions:", error);
    return null;
  }
}