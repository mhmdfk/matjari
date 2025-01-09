'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getInfo } from "../global_components/dataInfo";
import Loading from "../global_components/loading";

const Button = ({ text, link, onClick, hasNewMessages, photo }) => {
    return (
        <Link 
            href={link} 
            className="focus:bg-gray-200 focus:text-blue-600 hover:bg-gray-200 hover:text-blue-600 text-black mb-1 rounded"
        >
            <div 
                onClick={onClick} 
                className="w-full h-16 flex flex-row justify-start items-center gap-4 relative px-6 border-b border-gray-100"
            >
                {photo && (
                    <img 
                        src={photo} 
                        alt={`${text} avatar`} 
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
                <span className="text-lg font-medium flex-1">{text}</span>
                {hasNewMessages && (
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full ml-2"></span>
                )}
            </div>
        </Link>
    );
};


const SideNav = ({ onPress }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [roomsWithNewMessages, setRoomsWithNewMessages] = useState([]);


    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                // Fetch user info to get the user ID
                const result = await getInfo();
                const userId = result.id;
                setUserId(userId);

                // Fetch chat rooms for the user
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/get-rooms/${userId}`);
                const roomsData = await response.json();

                // Set the fetched chat rooms into state
                setChatRooms(roomsData);

            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchChatRooms();
    }, []);  // Empty dependency array means this runs once after the component mounts

    useEffect(() => {
        const fetchNewMessages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/newmessages/${userId}`);
                const data = await response.json();
                console.log('New messages data:', data);
                setRoomsWithNewMessages(data.rooms);
                console.log(data.rooms);
            } catch (error) {
                console.error('Error fetching new messages:', error);
            }
        }
        if (userId) {
            fetchNewMessages();
        }
    }, [userId])

    if (loading) {
        return <Loading></Loading>
    }

    return (
        <nav className="h-full w-full flex flex-col px-2 py-8 rounded-md shadow-md">
            {chatRooms.length > 0 ? (
                chatRooms.map((room) => (
                    <Button 
                        key={room.id}
                        text={room.user_name}
                        link={`/chats/${room.id}`}
                        onClick={onPress}
                        hasNewMessages={roomsWithNewMessages.includes(room.id)}
                        photo={room.photo || '/Resources/profile-pic.jpg'}
                    />
                ))
            ) : (
                <div>No chat rooms found</div>
            )}
        </nav>
    );
};

export default SideNav;
