import { Icon } from '@iconify-icon/react';
import { actions } from 'astro:actions';
import { useEffect, useRef, useState } from 'react';

interface ReviewRater {
    userid: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string;
    gender: string;
    phone: string;
    age: number;
    role: string;
    is_online: boolean;
    is_available: boolean;
    created_at: string;
    current_vehicle: any;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    rater: ReviewRater;
    ratee: ReviewRater;
    created_at: string;
}

const ReviewsContent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const componentRef = useRef<HTMLDivElement>(null);
    const hasLoadedRef = useRef<boolean>(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const { data, error: errorReviews } = await actions.User.getReviewsUser({});

                if (errorReviews) {
                    setError(true);
                } else if (data) {
                    setReviews(data as Review[]);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        // Lazy loading: only fetch when component is visible
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasLoadedRef.current) {
                    hasLoadedRef.current = true;
                    fetchReviews();
                }
            },
            { threshold: 0.1 }
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(10)].map((_, index) => (
                    <Icon
                        key={index}
                        icon="solar:star-bold-duotone"
                        className={`text-lg ${index < rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                ))}
            </div>
        );
    };

    if (error) {
        return (
            <div ref={componentRef} className="text-center py-8">
                <p className="text-red-400">Error al cargar las reseñas. Por favor, inténtalo de nuevo.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div ref={componentRef} className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Cargando reseñas...</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div ref={componentRef} className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Aún no tienes reseñas.</p>
            </div>
        );
    }

    return (
        <div ref={componentRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-3"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={review.rater.image_url || "/images/domiciliarioConCajas-min.webp"}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                                alt={`${review.rater.first_name} ${review.rater.last_name}`}
                            />
                            <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                    @{review.rater.username}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {review.rater.first_name} {review.rater.last_name}
                                </p>
                            </div>
                        </div>
                        {renderStars(Number(review.rating))}
                    </div>
                    
                    {review.comment ? (
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                            "{review.comment}"
                        </p>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Icon icon="solar:sad-square-bold-duotone" className="text-gray-400 dark:text-gray-600 text-2xl mb-1" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Sin comentario.
                        </p>
                        </div>
                    )}
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                        {formatDate(review.created_at)}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReviewsContent;
