import React, { useState, useEffect } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';

const PlayVideo = () => {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    try {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&regionCode=IN&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setApiData(data.items[0]);
      } else {
        throw new Error('Video data not found');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchOtherData = async () => {
    try {
      if (!apiData) return;

      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelResponse = await fetch(channelData_url);
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        setChannelData(channelData.items[0]);
      } else {
        throw new Error('Channel data not found');
      }

      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&textFormat=plainText&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
      const commentResponse = await fetch(comment_url);
      const commentData = await commentResponse.json();
      if (commentData.items) {
        setCommentData(commentData.items);
      } else {
        throw new Error('Comments not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='play-video'>
      <iframe
        width="693"
        height="390"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={apiData ? apiData.snippet.title : 'Loading...'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : 'Title'}</h3>
      <div className="play-video-info">
        <p>{apiData ? `${value_converter(apiData.statistics.viewCount)} Views • ${moment(apiData.snippet.publishedAt).fromNow()}` : 'Loading...'}</p>
      </div>
      <div>
        <span><img src={like} alt="like" /> {apiData ? value_converter(apiData.statistics.likeCount) : 'Loading...'}</span>
        <span><img src={dislike} alt="dislike" /></span>
        <span><img src={share} alt="share" /> share</span>
        <span><img src={save} alt="save" /> save</span>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : ''} alt="" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : 'Loading...'}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : 'Loading...'} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description : 'Description Here'}</p>
        <p>Subscribe to GreatStack to watch more tutorials on web development.</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 'Loading...'} Comments</h4>
      </div>
      {commentData.length > 0 ? commentData.map((item, index) => (
        <div key={index} className="comment">
          <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
          <div>
            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>{item.snippet.topLevelComment.snippet.likeCount}</span>
              <img src={dislike} alt="" />
            </div>
          </div>
        </div>
      )) : <p>No comments available</p>}
    </div>
  );
}

export default PlayVideo;
