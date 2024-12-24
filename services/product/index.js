const FileUpload = require("../../models/upload_file");
const Product = require("../../models/product");

const createFileAndChunkListProduct = async (chunks, file_name, file_type) => {
    try {
        const existingFileUpload = await FileUpload.findOne({ file_name, file_type });

        if (existingFileUpload) {
            // Step 1: Get the current chunk IDs associated with this file
            const currentChunkIds = existingFileUpload.chunk_lists;

            // Step 2: Create the new chunks
            const chunkingList = [];

            for (const chunk of chunks) {
                const chunkData = {
                    name: chunk.name,
                    category: chunk.category,
                    price: chunk.price,
                    color: chunk.color,
                    sizes: chunk.sizes.map(size => size),
                    description: chunk.description.map(desc => desc),
                    images: chunk.images,
                    total_stock: chunk.total_stock,
                    sold_count: chunk.sold_count,
                    review_count: chunk.review_count,
                    rating_count: chunk.rating_count,
                    avg_rating: chunk.avg_rating
                };

                // Step 3: Check if the chunk already exists
                let existingChunk = await Product.findOne({
                    name: chunkData.name,
                    category: chunkData.category,
                    price: chunkData.price,
                    color: chunkData.color,
                    sizes: chunkData.sizes,
                    description: chunkData.description,
                    images: chunkData.images,
                });

                // Step 4: Create new chunk if it doesn't exist or reuse existing chunk
                if (!existingChunk) {
                    existingChunk = await Product.create(chunkData);
                }
                chunkingList.push(existingChunk._id);
            }
            const chunksToRemove = currentChunkIds.filter(chunkId => !chunkingList.includes(chunkId));
            if (chunksToRemove.length > 0) {
                await Product.deleteMany({ _id: { $in: chunksToRemove } });
            }
            existingFileUpload.chunk_lists = chunkingList;
            existingFileUpload.update_date = new Date();
            await existingFileUpload.save();
            return {
                status: "Success",
                message: "File and chunks updated successfully",
                file: existingFileUpload,
            };

        } else {
            const createdChunks = await Product.insertMany(chunks.map(chunk => ({
                name: chunk.name,
                category: chunk.category,
                price: chunk.price,
                color: chunk.color,
                sizes: chunk.sizes,
                description: chunk.description,
                images: chunk.images,
                total_stock: chunk.total_stock,
                sold_count: chunk.sold_count,
                review_count: chunk.review_count,
                rating_count: chunk.rating_count,
                avg_rating: chunk.avg_rating
            })));
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
        console.error(error);
        return {
            status: "Error",
            message: error.message || "An error occurred",
        };
    }
};

module.exports = {
    createFileAndChunkListProduct,
};

