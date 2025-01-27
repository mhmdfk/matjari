'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { FaArrowLeft, FaArrowRight, FaComment, FaHeart, FaPen, FaRegHeart } from 'react-icons/fa';
import Loading from '@/app/[locale]/global_components/loading';
import { useTranslations } from 'next-intl';
import ErrorPage from '../../ErrorPage';
import { getInfo } from '../../global_components/dataInfo';
import { FaTrashCan } from 'react-icons/fa6';
import Popup from '../../popup';
import Link from 'next/link';
import ItemsDisplay from '../../home/ItemsDisplay';
import ReportButton from '../../global_components/report-button';
import ReportPage from '../../global_components/report-button';


const ProductPage = ({ params }) => {
    const router = useRouter();
    const [Heart, setHeart] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userPhoto, setUserPhoto] = useState('/Resources/profile-pic.jpg');
    const [edit, setEdit] = useState(false);
    const [item, setItem] = useState(null);
    const itemID = use(params).id;
    const t = useTranslations('Item');
    const [error, setError] = useState(null); // State to track errors
    const [userEmail, setUserEmail] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [user_id, setUserId] = useState(null);
    const [moreItems, setMoreItems] = useState();

    useEffect(() => {
        const fetchMoreItems = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${item.sub_category}/1/6`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch items: ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data);
                setMoreItems(data.items.filter((i) => i.id != itemID));
            } catch (error) {
                setError(error.message);
            }
        }
        if (item) {
            fetchMoreItems();
        }
    }, [item])

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/${itemID}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }

                const data = await response.json();
                setItem(data);
                setUserPhoto(data.userPhoto || '/Resources/profile-pic.jpg');
            } catch (error) {
                //console.error("Error fetching item:", error);
                setError(error.message); // Set error state
            }
        };

        fetchItem();
    }, [itemID]);

    useEffect(() => {
        const AddToLastSeen = () => {
            console.log('adding')
            const maxItems = 6; // Maximum number of items to store
            const key = "latestSeenItems";

            let latestSeen = JSON.parse(localStorage.getItem(key)) || [];

            latestSeen = latestSeen.filter((i) => i.id != itemID);

            latestSeen.unshift({ id: itemID, title: item.title, image: item.photos[0], price: item.price });

            latestSeen = latestSeen.slice(0, maxItems);

            localStorage.setItem(key, JSON.stringify(latestSeen));
        }
        if (item) {
            AddToLastSeen();
        }
    }, [item]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const info = await getInfo();
                if (info) {
                    setUserId(info.id);
                    setUserEmail(info.email);
                }
            } catch (error) {
                //setError(error.message);
            }
        }
        fetchUser();
    }, [itemID]);

    useEffect(() => {
        const fetchFavourited = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${itemID}/${user_id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch favourited state');
                }

                const data = await response.json();
                console.log(data);
                setHeart(data.favourited);
            } catch (error) {
                setError(error.message);
            }
        }
        if (user_id) {
            fetchFavourited();
        }
    }, [itemID, user_id]);

    const HandleDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listing/delete/${itemID}`, {
                method: 'DELETE', // Explicitly set the method to DELETE
            });
            if (!response.ok) {
                throw new Error('Failed to delete listing');
            }
            router.push('/home');
        } catch (error) {
            setError(error.message || 'Failed to delete listing');
        }
    }

    if (error) {
        return <ErrorPage statusCode={404} message={error} />; // Render error page on error
    }

    if (!item) return <Loading>Loading...</Loading>;

    const {
        title,
        price,
        description,
        condition,
        delivery,
        location,
        username,
        phone_number,
        email,
        photos = [],
        customDetails = {},
        created_at
    } = item;

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    }

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    }

    const handleButtonClick = async () => {
        if (user_id) { // Check if user is logged in
            try {

                const current_user_id = user_id;
                const item_user_id = item.user_id;

                console.log("#current_user_id", current_user_id);
                console.log("#item_user_id", item_user_id);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/find-or-create-room`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Inform server that you are sending JSON data
                    },
                    body: JSON.stringify({
                        userId1: current_user_id,
                        userId2: item_user_id,
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create or find room');
                }

                const data = await response.json();
                console.log("+_+");
                console.log(data);



                // Assuming you want to navigate after the data is returned
                console.log(data.room.id);
                router.push(`/chats/${data.room.id}`); // You can use the room_id from the response data
                // router.push(`/chats/2`); // You can use the room_id from the response data
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            router.push("/login");
        }
    }

    const HandleFavouriteClick = async () => {
        // change the item favourite status in the database
        if (user_id) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user_id, listingId: itemID }),
                });

                if (!response.ok) {
                    throw new Error('Failed to toggle favorite');
                }

                const result = await response.json();
                console.log(result.message);
                setHeart((prevHeart) => !prevHeart); // Toggle the UI state
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        }
        else {
            //redirect to login page if user is not logged in
            router.push("/login");
        }
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Minimum distance to register a swipe

    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = 0; // Reset values on touch start
        touchEndY = 0;
    };

    const handleTouchMove = (e) => {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        // Lock swipe to horizontal gestures
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                nextImage(); // Swipe left
            } else {
                prevImage(); // Swipe right
            }
        }
    };

    return (
        <>
            <div className="flex flex-col md:grid md:grid-cols-4 justify-items-center sm:p-8 sm:gap-4 sm:bg-gray-100">
                <div className="col-span-3 row-span-2 flex flex-col md:flex-row w-full bg-white p-10 rounded-lg gap-y-4 gap-x-16">
                    {/* Report Button */}
                    <ReportPage userId={user_id} itemId={itemID} />
                    {/* Product Image */}
                    <div className="w-full relative flex-col items-center self-center" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                        <div className="w-full sm:h-80 flex justify-center">
                            <img
                                src={photos[currentIndex]}
                                alt="Product"
                                className="w-full h-full max-w-sm max-h-80 object-contain rounded-lg"
                            />
                        </div>
                        <div className="hidden lg:flex justify-center mt-4 w-full">
                            {photos.map((image, index) => (
                                <div
                                    key={index}
                                    className="w-16 h-16 cursor-pointer m-2 border-2 rounded-lg hover:border-blue-500"
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index}`}
                                        className="w-full h-full object-cover rounded-md"
                                        style={{ aspectRatio: '1 / 1' }}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Dots */}
                        {photos.length > 1 &&
                            <div className="flex lg:hidden justify-center mt-4">
                                {photos.map((_, index) => (
                                    <span key={index} className={`h-2 w-2 rounded-full mx-1 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col md:flex-row w-full bg-white p-6 sm:p-8 rounded-lg gap-y-4 gap-x-16">
                    {/* Product Details */}
                    <div className="w-full flex flex-col">
                        <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
                        <p className="tetx-xl lg:text-2xl font-semibold mt-4">{price} JD</p>
                        {/* Buttons */}
                        <div className="flex flex-col gap-y-4 sm:flex-row mt-6 justify-between h-full items-end">
                            {email !== userEmail && <button onClick={handleButtonClick} className={`h-12 w-full lg:w-24 flex flex-row items-center justify-center gap-2 bg-gray-800 text-white shadow-md text-lg rounded-full sm:rounded-lg hover:bg-gray-700`}>
                                <FaComment size={20} />
                                <span className="block text-sm sm:text-lg font-semibold">{t('chat')}</span>
                            </button>}
                            {email !== userEmail && <button data-testid="favBtn" onClick={HandleFavouriteClick} className={`h-12 w-full sm:w-12 flex flex-row items-center justify-center gap-2 bg-white text-red-500 hover:bg-gray-100 rounded-full shadow sm:shadow-md`}>
                                {Heart ? <FaHeart size={24} color={'crimson'} /> : <FaRegHeart size={26} />}
                                <span className="block sm:hidden text-sm font-semibold">{t('fav')}</span>
                            </button>}
                            {/* Edit button for seller (change hidden to flex to show) */}
                            {email == userEmail && <Link href={{ pathname: '/edit_listing', query: { id: itemID } }} className={`h-10 w-full sm:w-10 flex items-center justify-center gap-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700`}>
                                <FaPen />
                                <span className="block sm:hidden text-sm font-semibold">{t('edit')}</span>
                            </Link>}
                            {email == userEmail && <button onClick={togglePopup} className={`h-10 w-full sm:w-10 flex items-center justify-center gap-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-700`}>
                                <FaTrashCan />
                                <span className="block sm:hidden text-sm font-semibold">{t('delete')}</span>
                            </button>}
                        </div>
                    </div>
                </div>
                {/* Seller Info */}
                <div className="flex items-center w-full bg-white p-6 sm:p-8 rounded-lg gap-x-6">
                    <img
                        onClick={() => router.push(`/user/${item.user_id}`)}
                        src={userPhoto}
                        alt="Profile"
                        className="lg:w-24 lg:h-24 w-16 h-16 rounded-full cursor-pointer object-cover border-2 border-gray-200"
                    />
                    <div className='flex flex-col'>
                        <h1 onClick={() => router.push(`/user/${item.user_id}`)} className="font-bold text-md hover:underline cursor-pointer">{username}</h1>
                        {phone_number != null && <h2 className='text-md'>{phone_number}</h2>}
                    </div>
                </div>
                {/* Additional Details */}
                <div className="col-span-2 h-fit flex flex-col w-full bg-white p-6 sm:p-8 rounded-lg gap-y-4 gap-x-16">
                    <h1 className="font-bold text-xl mb-4">{t('details')}</h1>
                    <ul className="grid md:grid-cols-2 gap-y-2 list-disc list-inside">
                        <li><strong>Location:</strong> {location}</li>
                        <li><strong>Delivery:</strong> {delivery == "Yes" ? "Yes" : "No"}</li>
                        <li><strong>Condition:</strong> {condition}</li>
                        <li><strong>Listed on:</strong> {created_at}</li>
                        {customDetails.map((detail, index) => (
                            <li key={index}>
                                <strong>{detail.title}:</strong> {detail.description}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Description */}
                <div className="col-span-2 h-fit flex flex-col w-full bg-white p-6 sm:p-8 rounded-lg gap-y-4 gap-x-16">
                    {/* Title */}
                    <h1 className="font-bold text-xl mb-4">{t('desc')}</h1>
                    {/* Text content */}
                    <p>
                        {description}
                    </p>
                </div>
                {/* Popup for Delete item */}
                {isOpen && (
                    <Popup title={t('delete')} togglePopup={togglePopup}>
                        <div className="flex space-x-4 mt-4 w-full justify-between">
                            <button
                                onClick={HandleDelete}
                                className="bg-red-500 text-white px-4 py-2 w-1/3 rounded hover:bg-red-600"
                            >
                                {t('yes')}
                            </button>
                            <button
                                onClick={togglePopup}
                                className="bg-gray-300 text-black px-4 py-2 w-1/3 rounded hover:bg-gray-400"
                            >
                                {t('no')}
                            </button>
                        </div>
                    </Popup>
                )}
            </div>
            {(moreItems && moreItems.length) > 0 &&
                <div className='flex flex-col sm:p-4'>
                    <h1 className='text-3xl font-semibold p-4'>{t('more')}</h1>
                    <ItemsDisplay items={moreItems} />
                </div>
            }
        </>
    );
};

export default ProductPage;
