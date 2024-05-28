import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { Link } from 'react-router-dom';
import { API_KEY } from '../../data';

const Recommended = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);

    const fetchData = async () => {
        const relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IN&videoCategoryId=${categoryId}&key=${API_KEY}`;
        
        try {
            const response = await fetch(relatedVideoUrl);
            const data = await response.json();
            setApiData(data.items || []); // Handle case where data.items might be undefined
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    return (
        <div className='recommended'>
            {apiData.map((item, index) => {
                const thumbnailUrl = item.snippet.thumbnails.medium.url;
                return (
                    <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                        <img src={thumbnailUrl} alt={item.snippet.title} />
                        <div className="vid-info">
                            <h4>{item.snippet.title}</h4>
                            <p>{item.snippet.channelTitle}</p>
                            <p>{`${item.statistics.viewCount} Views`}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default Recommended;



