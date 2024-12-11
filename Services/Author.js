import Author from "../Models/Author.js";

class AuthorService {
    async createAuthor(authorData, image){
        try {
            const author = {
                ...authorData,
                profileImageUrl:image

            }
            const newAuthor = await Author.create(author);
            return newAuthor;
        } catch (error) {
            throw new Error(`Error creating Author ${error.message}`)
        }
    }
    async fetchAuthor(id){
        try {
            const author = await Author.findById(id);
            if(!author){
                throw new Error("author not found")
            }
            return author
        } catch (error) {
            throw new Error(`Error fetching author: ${error.message}`);
        }
    }
    async deleteAuthor(id){
        try {
            const author = await Author.findByIdAndDelete(id);
            if(!author){
                throw new Error('author not found')
            }
            return author
        } catch (error) {
            throw new Error(`error deleting author: ${error.message}`)

        }
    }
    async updateAuthor(id, update){
        try {
            const updates = await Author.findByIdAndUpdate(id, {$set:update}, {new:true});
            return updates
        } catch (error) {
            throw new Error(`Error updating author: ${error.message}`)

        }
    }
    async getAuthorById(id, language){
        try {
            
       
        const author = await Author.findById(id);
        if(!author){
            throw new Error("author not found");
        }
            const selectedLanguage = language || "en";
            const projection = {
                email: 1,
                profileImageUrl: 1,
                birthDate: 1,
                createdAt: 1,
                updatedAt: 1,
                [`name.${selectedLanguage}`]: 1,
                [`biography.${selectedLanguage}`]: 1,
            }
            const authorDetails = await Author.findById(id, projection);
            if (!authorDetails) {
                throw new Error("Author not found");
            }
            return authorDetails
        } catch (error) {
            throw new Error(`Error fetching author by ID: ${error.message}`);

        }
    }
}

export default new AuthorService()