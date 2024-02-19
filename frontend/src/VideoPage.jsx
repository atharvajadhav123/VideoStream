  import { useParams } from 'react-router-dom';
  import React, { useState, useEffect } from 'react';
  import Navbar from "./Navbar";
  import VideoGrid from "./video";
  import Shufflebox from './Shufflebox';
  import { NavLink } from 'react-router-dom';
  import Comments from './Comments';
  import Footer from './Footer';
  import './VideoPage.css';
  import ShowInfo from './ShowInfo';
  const VideoPage = () => {
    const { name } = useParams();
    const decodedName = decodeURIComponent(name);
    const [videoData, setVideoData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [randomData, setRandomData] = useState([]);
    const { id } = useParams();
    const [keyword, setKeyword] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [userid, setUserid] = useState("");
    const [recommended, setRecommendedData] = useState([]);
    const [showinfo, setShowInfoData] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null); // Initialize videoUrl with null


    const handleKeywordChange = (e) => {
      setKeyword(e.target.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleForward();
      }
    };

    useEffect(() => {
      const storedUserId = localStorage.getItem('userid');
      setUserid(storedUserId || '');
    }, [localStorage]);

    useEffect(() => {
      // Fetch video data from your API without using a query parameter
      if (decodedName) {
        fetch('http://localhost:8081/showinfo', {
          method: 'POST', // or 'GET', 'PUT', etc., depending on your backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ decodedName }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.data) {
              setShowInfoData(data.data);

            } else {
              console.error('Unexpected response format:', data);
            }
          })
          .catch((error) => {
            console.error('Error fetching video data:', error);
          });
      }
    }, [decodedName, id]); // Include decodedName as a dependency if needed


    useEffect(() => {
      // Fetch video data from your API without using a query parameter
      if (decodedName) {
        fetch('http://localhost:8081/recommended', {
          method: 'POST', // or 'GET', 'PUT', etc., depending on your backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ decodedName, id }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.data) {
              setRecommendedData(data.data);

            } else {
              console.error('Unexpected response format:', data);
            }
          })
          .catch((error) => {
            console.error('Error fetching video data:', error);
          });
      }
    }, [decodedName, id]); // Include decodedName as a dependency if needed

  /*
    useEffect(() => {
      // Fetch video data from your API without using a query parameter
      if (decodedName) {
        fetch('http://localhost:8081/video', {
          method: 'POST', // or 'GET', 'PUT', etc., depending on your backend
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ decodedName, id }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.data) {
              setVideoData(data.data);

            } else {
              console.error('Unexpected response format:', data);
            }
          })
          .catch((error) => {
            console.error('Error fetching video data:', error);
          });
      }
    }, [decodedName, id]); // Include decodedName as a dependency if needed
  */
  
    useEffect(() => {
      // Fetch video data from your API without using a query parameter
      if (decodedName) {
        fetch('http://localhost:8081/random', {
          method: 'POST', // or 'GET', 'PUT', etc., depending on your backend
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.data) {
              setRandomData(data.data);
              console.log(data.data);
            } else {
              console.error('Unexpected response format:', data);
            }
          })
          .catch((error) => {
            console.error('Error fetching video data:', error);
          });
      }
    }, [decodedName, id]); // Include decodedName as a dependency if needed
    
    useEffect(() => {
      const formData = {
        show_name: decodedName, 
      };
      fetch('http://localhost:8081/video-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((responseData) => {
          if (responseData.success === true && responseData.data.length > 0) {
            const dataArray = responseData.data;
            setFilterData(dataArray);
            console.log(dataArray);
          } else {
            console.error('Unexpected data format:', responseData);
          }
        })
        .catch((error) => console.error('Error fetching data:', error));

      handleForward(formData); // Call the fetchData function when the component mounts
    }, [id]);
    
    const handleForward = async (formData) => {
     
        fetch('http://localhost:8081/video-filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((responseData) => {
            if (responseData.success === true && responseData.data.length > 0) {
              const dataArray = responseData.data;
              setFilterData(dataArray);
              console.log(dataArray);
            } else {
              console.error('Unexpected data format:', responseData);
            }
          })
          .catch((error) => console.error('Error fetching data:', error));  
    };



    useEffect(() => {
      fetchComments();
    }, [id]);

    const fetchComments = () => {
      fetch(`http://localhost:8081/comments/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setComments(data.data);
          } else {
            console.error('Error fetching comments:', data.error);
          }
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
        });
    };

    const handleTextareaChange = (e) => {
      setComment(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Check if the comment is not empty before submitting
      if (comment.trim() === '') {
        alert('Comment cannot be empty');
        return;
      }

      // Perform your submit logic here
      console.log('Submitting comment:', comment);

      // Clear the textarea after submitting
      setComment('');

      // Insert a new comment
      fetch('http://localhost:8081/insert-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId: id, commentContent: comment, userId: localStorage.getItem('userid'), Email: localStorage.getItem('email') }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Comment inserted successfully');
            // Fetch comments again after submitting
            fetchComments();
          } else {
            console.error('Error inserting comment:', data.error);
          }
        })
        .catch(error => {
          console.error('Error inserting comment:', error);
        });
    };

    return (
      <>
        <Navbar />
        <div className="row ">
          <div className="col md-3">

            <div className="row no-gutters">
              <div className="col  video-col">

                <div className="filter video-filter">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    name="keyword"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
            <div className="row no-gutters button-row">
              <div className="col button-col">
                <div className="button-container">
                  <div className="button-grid">
                    {filterData.map((filter, index) => (
                      <NavLink
                        key={index}
                        className="watch-link"
                        to={`/VideoPage/${encodeURIComponent(name)}/${filter.video_id}`}

                      >
                        <div
                          className={`episode-buttons ${index % 2 === 0 ? 'even' : 'odd'}`}
                        >
                          <div className="video-info">
                            <div className="episode-numbers">
                            {filter.episode_number}
                            </div>
                            <div className="episode_names">
                            {filter.video_name}

                            </div>
                          </div>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col md-7 video-container">
         
  <VideoGrid
    key={1}
    video_id={id}
    
  />

          </div>
          <div className="col md-3">
            <div className="filter-title2">
              Random
            </div>
            {randomData.map((random, index) => (
              <Shufflebox key={index} imageUrl={`/images/card-poster${random.showid}.jpg`} title={random.title} Season={random.season} TotalEpisodes={random.total_episodes} Date={random.date} paraid={random.id} />
            ))}
          </div>
        </div>
        <div className="row">
          {showinfo.map((show, index) => (
            <ShowInfo key={index} name={show.show_name} description={show.show_description} imageid={show.show_id} type={show.show_type} ratings={show.show_ratings} date={show.formatted_date} genre={show.genres} status={show.show_status} />
          ))}
        </div>
        <div className="col-md-9">
          <div className="row">
            <img className="mega" src="/images/mega.jpg" alt="" />
          </div>
        </div>
        <div className="row comment-section">
          {/* Left column (70%) */}

          <div className="col-md-9">
            <div className="card-footer py-3 border-0">
              {/* Render comments if the user is logged in */}
              {comments.map((comment, index) => (
                <Comments
                  key={index} // Make sure to use a unique key for each component
                  username={comment.email}
                  date={comment.comment_date}
                  commentcontent={comment.comment_content}
                />
              ))}
              {userid && (
                <form onSubmit={handleSubmit}>
                  <div className="d-flex flex-start">
                    <img
                      className="rounded-circle shadow-1-strong me-3"
                      src="images/userimg.png"
                      alt="avatar"
                      width="40"
                      height="40"
                    />
                    <div className="form-outline w-100">
                      <textarea
                        className="form-control"
                        id="textAreaExample"
                        name="comment_content"
                        rows="4"
                        style={{ background: '#fff' }}
                        value={comment}
                        onChange={handleTextareaChange}
                      ></textarea>
                      <input type="hidden" value="comment" name="comment" />
                      <label className="form-label" htmlFor="textAreaExample">
                        Message
                      </label>
                    </div>
                  </div>
                  <div className="float-end mt-2 pt-1">
                    <button type="submit" className="btn btn-sm comment-button" onClick={handleSubmit}>
                      Post comment
                    </button>
                    <button type="button" className="btn btn-sm comment-button">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="col md-3">
            <div className="filter-title2">
              Recommended
            </div>
            {recommended.map((random, index) => (
              <Shufflebox key={index} imageUrl={`/images/card-poster${random.showid}.jpg`} title={random.title} Season={random.season} TotalEpisodes={random.total_episodes} Date={random.date} paraid={random.id} />
            ))}
          </div>
        </div>

        <Footer />
      </>
    );
  };

  export default VideoPage;
