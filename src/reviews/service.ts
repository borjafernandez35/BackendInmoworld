import { IReview } from './model'
import review from './schema'

export const getEntries = {
    getAll: async() => {
        return await review.find()
    },
    findById: async(id: String) => {
        return await review.findById(id)
    },
    filterReview: async(query: any): Promise<IReview | null>=> {
        try {
            return await review.findOne(query);
        } catch (error) {
            throw error;
        }
    },
    create: async(entry: object) => {
        console.log(entry)
        return await review.create(entry)
    },
    update: async(id: String, body: object) => {
        console.log(body)
        return await review.findByIdAndUpdate(id, body, {$new:true})
    },
    updateReview: async(review_params: IReview, review_filter: any): Promise<void> => {
        try {
            await review.findOneAndUpdate(review_filter, review_params)
        } catch (error) {
            throw error
        }
    },
    delete: async(id: String) => {
        return await review.findByIdAndDelete(id)
    },
    deleteReview: async(id: String): Promise<{ deletedCount: number }> => {
        try {
            const query = {id: id}
            const update = { active: false}
            const result = await review.updateOne(query, update)

            return { deletedCount: result.modifiedCount }
        } catch (error) {
            throw error
        }
    }
}