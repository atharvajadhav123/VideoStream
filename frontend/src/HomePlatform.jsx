import React from "react";
import "./HomePlatform.css";
import Card from "./Card";
import RankingBox from "./RankingBox";
import { useState } from 'react';
import Shufflebox from "./Shufflebox";
import { useEffect } from "react";
const HomePlatform = () => {
  const [activeTab, setActiveTab] = useState('daily-rank');
  const [cardsData, setCardsData] = useState([]);
  const [rankData, setRankData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [shuffleboxData, setShuffleboxData] = useState([]);
  const [ongoingData, setOngoingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);

  useEffect(() => {

    fetch('http://localhost:8081/new', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setShuffleboxData(data.data);
          console.log('carousel data', data.data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching video data:', error);
      });
  }
    , []);

  useEffect(() => {

    fetch('http://localhost:8081/completed', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setCompletedData(data.data);
          console.log('carousel data', data.data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching video data:', error);
      });
  }
    , []);

  useEffect(() => {

    fetch('http://localhost:8081/ongoing', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setOngoingData(data.data);
          console.log('carousel data', data.data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching video data:', error);
      });
  }
    , []);


  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/${activeTab}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.success && Array.isArray(responseData.data) && responseData.data.length > 0) {
          const rankArray = responseData.data;
          setRankData(rankArray);
        } else {
          console.error('Unexpected data format:', responseData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [activeTab]);


  const fetchCardsData = (page, pageSize) => {
    fetch(`http://localhost:8081/cards?page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData.success && Array.isArray(responseData.data) && responseData.data.length > 0) {
          const dataArray = responseData.data;
          setCardsData(dataArray);
        } else {
          console.error('Unexpected data format:', responseData);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchCardsData(page, pageSize);
  }, [page, pageSize]);


  const handleNextClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevClick = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-9 right-box">
            <div className="row right-row">
              <img src="/images/anime-nomination.png" alt="" />

              <div className="head with-more with-tabs">
                <div className="recent mr-3">Recently Updated</div>
                <div className="end">
                  <span className="text-tabs">
                    <span data-name="updated-all" className="tab active">
                      All
                    </span>
                    <span data-name="updated-sub" className="tab">
                      Sub
                    </span>
                    <span data-name="updated-dub" className="tab">
                      Dub
                    </span>

                    <span data-name="trending" className="tab">
                      Trending
                    </span>

                  </span>
                </div>
              </div>
              <span className="paging">
                <span
                  className={`prev ${page === 1 && activeIndex === 0 ? 'disabled' : ''}`}
                  onClick={handlePrevClick}
                >
                  <i className="fa-solid fa-angle-left"></i>
                </span>
                <span
                  className={`next ${(page - 1) * pageSize + activeIndex + 1 >= cardsData.length ? 'disabled' : ''
                    }`}
                  onClick={handleNextClick}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </span>
              </span>
              {cardsData.map((card) => (
                <Card
                  key={card.videoid}
                  videoid={card.videoid}
                  Title={card.title}
                  Season={card.season}
                  Episode={card.episode}
                  Summary={card.summary}
                  OtherName={card.othername}
                  Scores={card.ratings}
                  Date={card.date}
                  Duration={card.duration}
                  Status={card.status}
                  Genre={card.genres}
                  Image={`/images/card-poster${card.showid}.jpg`}
                  TotalEpisodes={card.total_episodes}
                />
              ))}
              {/* Add more cards as needed */}
            </div>
          </div>

          {/* 30% column for empty space and rectangles */}
          <div className="col-md-3 left-box">
            <div className="rectangle-container">
              <div className="left-side">Top Anime</div>
              <div className="right-side">
                <div className="tabs">
                  <span
                    data-name="daily-rank"
                    className={`tab ${activeTab === 'daily-rank' ? 'active' : ''}`}
                    onClick={() => handleTabClick('daily-rank')}
                  >
                    Day
                  </span>
                  <span
                    data-name="weekly-rank"
                    className={`tab ${activeTab === 'weekly-rank' ? 'active' : ''}`}
                    onClick={() => handleTabClick('weekly-rank')}
                  >
                    Week
                  </span>
                  <span
                    data-name="monthly-rankly-rank"
                    className={`tab ${activeTab === 'monthly-rank' ? 'active' : ''}`}
                    onClick={() => handleTabClick('monthly-rank')}
                  >
                    Month
                  </span>
                </div>
              </div>
            </div>
            {/* Add your rectangle boxes here */}
            {rankData.map((rank, index) => (
              <RankingBox key={rank.showid} rank={index + 1} imageUrl={`/images/card-poster${rank.showid}.jpg`} title={rank.title} Season={rank.season} TotalEpisodes={rank.total_episodes} paraid={rank.id} />
            ))}
            {/* Add more boxes as needed */}
          </div>


          <div className="col-md-9">
            <div className="row">
              <img className="mega" src="/images/mega.jpg" alt="" />
            </div>


          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col md-3">
                <div className="shuffle-labels">NEW RELEASE<i className="fa-solid fa-arrow-right"></i></div>

                {shuffleboxData.map((data) => (
                  <Shufflebox
                    key={data.show_id}
                    imageUrl={`/images/card-poster${data.show_id}.jpg`}
                    title={data.title}
                    Episode={data.episode}
                    Season={data.season}
                    TotalEpisodes={data.TotalEpisodes}
                    Date={data.Date}
                    paraid={data.id}
                  />
                ))}

              </div>
              <div className="col md-3">
                <div className="shuffle-labels">ONGOING<i className="fa-solid fa-arrow-right"></i></div>
                {ongoingData.map((data) => (
                  <Shufflebox
                    key={data.show_id}
                    imageUrl={`/images/card-poster${data.show_id}.jpg`}
                    title={data.title}
                    Episode={data.episode}
                    Season={data.season}
                    TotalEpisodes={data.TotalEpisodes}
                    Date={data.Date}
                    paraid={data.id}
                  />
                ))}

              </div>
              <div className="col md-3">
                <div className="shuffle-labels">JUST COMPELETED <i className="fa-solid fa-arrow-right"></i></div>
                {completedData.map((data) => (
                  <Shufflebox
                    key={data.show_id}
                    imageUrl={`/images/card-poster${data.show_id}.jpg`}
                    title={data.title}
                    Episode={data.episode}
                    Season={data.season}
                    TotalEpisodes={data.TotalEpisodes}
                    Date={data.Date}
                    paraid={data.id}
                  />
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>
    </>
  );
};

export default HomePlatform;
