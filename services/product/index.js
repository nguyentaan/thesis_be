const FileUpload = require("../../models/upload_file");
const Product = require("../../models/product");

const createFileAndChunkListProduct = async (chunks, file_name, file_type) => {
    try {
        console.log("chunks: ", chunks);

        // Check if a file upload already exists
        const existingFileUpload = await FileUpload.findOne({ file_name, file_type });
        if (existingFileUpload) {
            const currentChunkIds = existingFileUpload.chunk_lists;
            const chunkingList = [];
            for (const chunk of chunks) {
                const chunkData = {
                    product_id: chunk.product_id,
                    product_code: chunk.product_code,
                    index_name: chunk.index_name,
                    name: chunk.name,
                    category: chunk.category,
                    price: chunk.price,
                    color: chunk.color,
                    description: chunk.description || "",
                    image_url: chunk.image_url || "",
                    total_stock: chunk.total_stock || 100,
                    sold_count: chunk.sold_count || 0,
                    review_count: chunk.review_count || 0,
                    rating_count: chunk.rating_count || 0,
                    avg_rating: chunk.avg_rating || 0.0,
                };

                // Check if the chunk already exists
                let existingChunk = await Product.findOne({ product_id: chunk.product_id });
                if (existingChunk) {
                    // Check if the new data is different
                    const isModified = Object.keys(chunkData).some(
                        key => chunkData[key] !== existingChunk[key]
                    );

                    if (isModified) {
                        // Update the existing chunk if modified
                        existingChunk = await Product.findByIdAndUpdate(
                            existingChunk._id,
                            { $set: chunkData },
                            { new: true }
                        );
                        console.log(`Updated modified chunk: ${chunk.product_id}`);
                    } else {
                        console.log(`Unchanged chunk skipped: ${chunk.product_id}`);
                    }
                } else {
                    // Create a new chunk
                    existingChunk = await Product.create(chunkData);
                }
                chunkingList.push(existingChunk._id);
            }

            // Remove chunks no longer needed
            const chunksToRemove = currentChunkIds.filter(chunkId => !chunkingList.includes(chunkId));
            if (chunksToRemove.length > 0) {
                await Product.deleteMany({ _id: { $in: chunksToRemove } });
            }

            // Update the existing file upload
            existingFileUpload.chunk_lists = chunkingList;
            existingFileUpload.update_date = new Date();
            await existingFileUpload.save();

            return {
                status: "Success",
                message: "File and chunks updated successfully",
                file: existingFileUpload,
            };
        } else {
            console.log("non exist:....");
            const createdChunks = [];
            for (const chunk of chunks) {
                const chunkData = {
                    product_id: chunk.product_id,
                    product_code: chunk.product_code,
                    index_name: chunk.index_name,
                    name: chunk.name,
                    category: chunk.category,
                    price: chunk.price,
                    color: chunk.color,
                    description: chunk.description || "",
                    image_url: chunk.image_url || "",
                    total_stock: chunk.total_stock || 100,
                    sold_count: chunk.sold_count || 0,
                    review_count: chunk.review_count || 0,
                    rating_count: chunk.rating_count || 0,
                    avg_rating: chunk.avg_rating || 0.0,
                };

                const existingChunk = await Product.findOne({ product_id: chunk.product_id });
                if (existingChunk) {
                    // Check if the new data is different
                    const isModified = Object.keys(chunkData).some(
                        key => chunkData[key] !== existingChunk[key]
                    );

                    if (isModified) {
                        await Product.findByIdAndUpdate(existingChunk._id, { $set: chunkData });
                        console.log(`Updated modified chunk: ${chunk.product_id}`);
                    } else {
                        console.log(`Duplicate chunk skipped: ${chunk.product_id}`);
                    }
                } else {
                    const newChunk = await Product.create(chunkData);
                    createdChunks.push(newChunk);
                }
            }

            // Create a new file upload document
            const chunkIds = createdChunks.map(chunk => chunk._id);
            const newFileUpload = await FileUpload.create({
                file_name,
                file_type,
                create_date: new Date(),
                update_date: new Date(),
                chunk_lists: chunkIds,
            });

            return {
                status: "Success",
                message: "File and chunks created successfully",
                file: newFileUpload,
            };
        }
    } catch (error) {
        console.error("Error in createFileAndChunkListProduct:", error);
        return {
            status: "Error",
            message: error.message || "An error occurred",
        };
    }
};
module.exports = {
    createFileAndChunkListProduct,
};
