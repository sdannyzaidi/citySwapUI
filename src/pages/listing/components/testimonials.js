import { Carousel } from 'antd'
import NoImage from '../../../assets/images/icon-no-image.svg'
import { mdiFolderOffOutline, mdiStar, mdiStarOutline } from '@mdi/js'
import Icon from '@mdi/react'

const Testimonials = ({ listing }) => {
	const testimonials = listing?.reviews?.map((review) => ({
		name: review?.user?.name,
		description: review?.content_review,
		rating: review?.rating,
	}))

	return (
		<Carousel autoplay>
			{testimonials ? (
				testimonials?.map((testimonial, t_index) => (
					<div>
						<div className='bg-[#F9FAFB] w-full h-[30rem] flex flex-col items-center justify-center text-center md:px-44 max-md:px-8'>
							<p className='text-[#101828] font-[700] max-md:text-lg sm:text-[36px] pb-8'>{testimonial.description}</p>
							<img src={testimonial?.user?.profilePic || NoImage} alt='' className='h-16 w-16 rounded-full object-cover' />
							<p className='text-[#101828] font-[600] sm:text-lg max-md:text-sm py-2'>{testimonial.name}</p>
							<div className='flex flex-row items-center'>
								{Array.from({ length: testimonial.rating }, (_, index) => (
									<Icon key={index} path={mdiStar} size={1} className='text-[#FFAC33]' />
								))}
								{Array.from({ length: 5 - testimonial.rating }, (_, index) => (
									<Icon key={index} path={mdiStarOutline} size={1} className='text-[#91919159]' />
								))}
							</div>
						</div>
					</div>
				))
			) : (
				<div>
					<div className='bg-[#F9FAFB] w-full h-[30rem] flex flex-col items-center justify-center text-center md:px-44 max-md:px-8'>
						<Icon path={mdiFolderOffOutline} size={3} className='text-[#91919159]' />
						<p className='text-[#74777f] font-[600] md:text-2xl max-md:text-sm py-2'>No Reviews</p>
					</div>
				</div>
			)}
		</Carousel>
	)
}

export default Testimonials
