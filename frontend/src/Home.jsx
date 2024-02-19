import React, { useState, useEffect } from "react";
import MyCarousel from "./Carousel";
import HomePlatform from "./HomePlatform";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Genre from "./Genre";

const Home = () => {
  const [carouselData, setCarouselData] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    // Fetch video data from your API without using a query parameter
      fetch('http://localhost:8081/carousel', {
        method: 'POST', // or 'GET', 'PUT', etc., depending on your backend
        
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setCarouselData(data.data);
            console.log('carousel data',data.data);
          } else {
            console.error('Unexpected response format:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching video data:', error);
        });

    }
  , []); // Include decodedName as a dependency if needed

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [carouselData]);

  return (
    <>
    <Navbar />
    {carouselData.length > 0 && (
        <MyCarousel
          title={carouselData[activeIndex].title}
          date={carouselData[activeIndex].date}
          description={carouselData[activeIndex].description}
          imageSrc={`/images/carousel${carouselData[activeIndex].showid}.jpg`}
          index={activeIndex}
          totalItems={carouselData.length}
          paraid={carouselData[activeIndex].id}
        />
      )}
      <div>Home</div>
      <HomePlatform />
      <Footer />
    
    </>
  );
};

export default Home;
