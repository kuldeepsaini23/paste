import Paste from "../Models/Paste.js";
import validator from "validator";
// Create a new paste
export const createPaste = async (req, res) => {
  try {
    const { title, content, access, expirationInDays, contentType } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user ID is available

    // Input validation
    if (!validator.isLength(title, { min: 1, max: 255 })) {
      return res.status(400).json({
        success: false,
        message: "Title must be between 1 and 255 characters.",
      });
    }

    if (!validator.isIn(access, ["public", "private"])) {
      return res.status(400).json({
        success: false,
        message: "Access must be either public or private.",
      });
    }

    console.log("USER ID", req.user);
    console.log("USER ID", req.body);

    if (!validator.isLength(content, { min: 1 })) {
      return res.status(400).json({
        success: false,
        message: "Content must not be empty.",
      });
    }

    if (!validator.isIn(contentType, ["code", "text", "json"])) {
      return res.status(400).json({
        success: false,
        message: "Content type must be either code, text, or json.",
      });
    }


    // Calculate the expiration date
    let expirationDate = null;
    if (expirationInDays) {
      expirationDate = new Date();
      expirationDate.setDate(
        expirationDate.getDate() + parseInt(expirationInDays)
      );
    }

    // Create the new paste
    const newPaste = new Paste({
      title: validator.escape(title),
      content: JSON.stringify(content), // Escape the content to prevent XSS attacks
      author: userId,
      access,
      expirationDate, // Set the expiration date
      contentType, // Set the content type
    });

    await newPaste.save();

    return res.status(201).json({
      success: true,
      message: "Paste created successfully",
    });
  } catch (error) {
    console.error("Error creating paste:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating paste",
    });
  }
};

// Get a paste by ID
export const getPasteById = async (req, res) => {
  try {
    const { pasteId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated and user ID is available

    // Validate the unique ID format
    if (!pasteId) {
      return res.status(400).json({
        success: false,
        message: "Paste ID is required.",
      });
    }

    const paste = await Paste.findById(pasteId);

    console.log("paste", paste);

    if (!paste) {
      return res.status(404).json({
        success: false,
        message: "Paste not found",
      });
    }

    // Check if the paste has expired
    if (paste.expirationDate && new Date() > paste.expirationDate) {
      return res.status(410).json({
        success: false,
        message: "This paste has expired",
      });
    }

    // Check if the paste is private and if the requesting user is the author
    if (paste.access === "private" && !paste.author.equals(userId)) {
      return res.status(403).json({
        success: false,
        private: true,
        message: "You do not have access to this paste",
      });
    }

    if (!paste.author.equals(userId)) {
      return res.status(200).json({
        success: true,
        paste: {
          title: paste.title,
          content: paste.content,
          contentType: paste.contentType,
          access: paste.access,
          expirationInDays: paste.expirationDate,
          edit: false,
        },
      });
    }

    // Returning the content type along with the paste
    return res.status(200).json({
      success: true,
      paste: {
        title: paste.title,
        content: paste.content,
        contentType: paste.contentType,
        access: paste.access,
        expirationInDays: paste.expirationDate,
        edit: true,
      },
    });
  } catch (error) {
    console.error("Error fetching paste:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching paste",
    });
  }
};

// Edit a paste by ID
export const editPaste = async (req, res) => {
  try {
    console.log("inside edit paste");
    const { pasteId } = req.params;
    const { title, content, access, expirationInDays, contentType } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user ID is available


    // Validate the unique ID format
    if (!pasteId) {
      return res.status(400).json({
        success: false,
        message: "Paste ID is required.",
      });
    }

    // Find the paste by its unique ID
    const paste = await Paste.findById(pasteId);

    if (!paste) {
      return res.status(404).json({
        success: false,
        message: "Paste not found",
      });
    }

    console.log("paste", paste);

    // Check if the user is the author of the paste
    if (!paste.author.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this paste",
      });
    }

    // Input validation for title, content, access, and contentType
    if (title && !validator.isLength(title, { min: 1, max: 255 })) {
      return res.status(400).json({
        success: false,
        message: "Title must be between 1 and 255 characters.",
      });
    }

    if (access && !validator.isIn(access, ["public", "private"])) {
      return res.status(400).json({
        success: false,
        message: "Access must be either public or private.",
      });
    }

    if (content && !validator.isLength(content, { min: 1 })) {
      return res.status(400).json({
        success: false,
        message: "Content must not be empty.",
      });
    }

    if (contentType && !validator.isIn(contentType, ["code", "text", "json"])) {
      return res.status(400).json({
        success: false,
        message: "Content type must be either code, text, or json.",
      });
    }

    // Update the expiration date if provided
    if (expirationInDays) {
      const expirationDate = new Date();
      expirationDate.setDate(
        expirationDate.getDate() + parseInt(expirationInDays)
      );
      paste.expirationDate = expirationDate;
    }

    // Update the paste with new data
    if (title) paste.title = validator.escape(title);
    if (content) paste.content = JSON.stringify(content);
    if (access) paste.access = access;
    if (contentType) paste.contentType = contentType;

    await paste.save();

    return res.status(200).json({
      success: true,
      message: "Paste updated successfully",
      paste,
    });
  } catch (error) {
    console.error("Error updating paste:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating paste",
    });
  }
};

// Delete a paste by ID
export const deletePaste = async (req, res) => {
  try {
    const { pasteId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated and user ID is available

    console.log("inside delete paste", req.user);

    // Validate the unique ID format
    if (!pasteId) {
      return res.status(400).json({
        success: false,
        message: "Paste ID is required.",
      });
    }

    // Find the paste by its unique ID
    const paste = await Paste.findById(pasteId);

    if (!paste) {
      return res.status(404).json({
        success: false,
        message: "Paste not found",
      });
    }

    // Check if the user is the author of the paste
    if (!paste.author.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this paste",
      });
    }

    // Log the content type before deletion for audit purposes
    console.log(
      `Deleting paste with ID: ${pasteId}, ContentType: ${paste.title}`
    );

    // Delete the paste
    await Paste.findByIdAndDelete(pasteId);

    return res.status(200).json({
      success: true,
      message: "Paste deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting paste:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting paste",
    });
  }
};

// Get all pastes
export const getAllPastes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please log in to view pastes.",
      });
    }
    const author = req.user.id; // Assuming req.user contains the user data with an _id field
    const { query } = req.query;
    // console.log("author", req.user);
    // console.log("author", author);

    const filter = { author }; // Filter pastes by the logged-in user's ID

    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    // Fetch pastes specific to the user with pagination
    const pastes = await Paste.find(filter).sort({ createdAt: -1 }).lean();

    console.log("PASTES", pastes);

    // Handle the case where no pastes are found
    if (pastes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pastes found.",
      });
    }

    const totalCount = await Paste.countDocuments(filter);

    // Return the paginated and filtered pastes
    return res.status(200).json({
      success: true,
      pastes,
    });
  } catch (error) {
    console.error("Error fetching all pastes:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pastes",
    });
  }
};

