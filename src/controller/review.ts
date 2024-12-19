import { Request, Response } from 'express'
import { IReview } from '../reviews/model'
import * as reviewServices from '../reviews/service'
/* eslint-disable */
export class reviewController {
    public async createReview(req: Request, res: Response) {
        try {
            if (req.body.user && req.body.property && req.body.rating && req.body.description) {
                const review_params: IReview = {
                  user: req.body.user,
                  property: req.body.property,
                  rating: req.body.rating,
                  description: req.body.description,
                  date: new Date()
                }
                const review_data = await reviewServices.getEntries.create(review_params)
                return res.status(201).json({ message: 'Review created succesfully', review: review_data})
            } else {
                return res.status(400).json({error: 'Missing fields'})
            }
        } catch (error) {
            return res.status(500).json({error: 'Error creating a review'})
        }
    }

    public async getAll(_req: Request, res: Response) {
      try {
          const review_data = await reviewServices.getEntries.getAll();
  
          // Mostrar las reviews en la consola
          console.log('Reviews obtenidas:', review_data);
  
          return res
              .status(200)
              .json({ reviews: review_data, totalReview: review_data.length });
      } catch (error) {
          console.error('Error al extraer las reviews:', error);
          return res.status(500).json({ error: 'Error al extraer todas las reviews' });
      }
  }
  
  

    public async getReview(req: Request, res: Response) {
        try {
            if (req.params.id) {
              const review_filter = req.params.id
              const review_data = await reviewServices.getEntries.findById(review_filter)
              
              return res.status(200).json({ data: review_data, message: 'Successful' })
            } else {
              return res.status(400).json({ error: 'Missing fields' })
            }
          } catch (error) {
            return res.status(500).json({ error: 'Internal server error' })
          }
    }

    public async updateReview(req: Request, res: Response) {
        try {
            if (req.params.id) {
             const review_filter = { _id: req.params.id }
             console.log(review_filter);
              const review_data = await reviewServices.getEntries.filterReview(review_filter)
              console.log(review_data);
              if (!review_data) {
                return res.status(400).json({ error: 'Review not found' });
              }
      
              const review_params: IReview = {
                user: req.body.name || review_data.user,
                property: req.body.property || review_data.property,
                rating: req.body.rating || review_data.rating,
                description: req.body.description || review_data.description,
                date: new Date()
              }

              await reviewServices.getEntries.updateReview(review_params, review_filter)
              const new_review_data = await reviewServices.getEntries.findById(req.params.id)
              console.log('update:',new_review_data);

              return res
                .status(200)
                .json({ data: new_review_data, message: 'Successful update' })
            } else {
              return res.status(400).json({ error: 'Missing ID parameter' })
            }
          } catch (error) {
            console.error('Error updating:', error)
            return res.status(500).json({ error: 'Error updating review' })
          }
    }

    public async deleteReview(req: Request, res: Response) {
        const reviewId = req.params.id

        return reviewServices.getEntries.delete(reviewId)
        .then((review) => (review ? res.status(201).json({ review, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }))
    }
}