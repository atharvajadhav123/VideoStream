import React, { useState } from "react";
import Navbar from "./Navbar";
import './Genre.css';
import Card from "./Card";
import { useEffect } from "react";
import TrendingBox from "./TrendingBox";
import Footer from "./Footer";
const Genre = () => {
  const [showGenres, setShowGenres] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [showSeasons, setShowSeasons] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [excludeWatchlist, setExcludeWatchlist] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [trendData,setTrendData] = useState([]);

  const handleToggleGenres = (e) => {
    e.preventDefault();
    setShowGenres(!showGenres);
  };

  const handleToggleCountries = (e) => {
    e.preventDefault();
    setShowCountries(!showCountries);
  };

  const handleToggleSeasons = (e) => {
    e.preventDefault();
    setShowSeasons(!showSeasons);
  };

  const handleToggleYears = (e) => {
    e.preventDefault();
    setShowYears(!showYears);
  };

  const handleToggleTypes = (e) => {
    e.preventDefault();
    setShowTypes(!showTypes);
  };

  const handleToggleStatus = (e) => {
    e.preventDefault();
    setShowStatus(!showStatus);
  };

  const handleToggleLanguages = (e) => {
    e.preventDefault();
    setShowLanguages(!showLanguages);
  };

  const handleToggleRating = (e) => {
    e.preventDefault();
    setShowRating(!showRating);
  };
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };
  const handleToggleWatchlist = (e) => {
    e.preventDefault();
    setExcludeWatchlist(!excludeWatchlist);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    fetchData(); // Call the fetchData function when the form is submitted
  };

  const fetchData = async (e) => {
    const formData = {
      show_name: keyword,
      genre: [],
      country: [],
      show_season: [],
      year: [],
      show_type: [],
      show_status: [],
      language: [],
      show_ratings: [],
      excludeWatchlist: '',
    };

    // Logic to collect selected genres
    document.querySelectorAll('input[name="genre"]:checked').forEach((checkbox) => {
      formData.genre.push(checkbox.value);
    });

    // Logic to collect selected countries
    document.querySelectorAll('input[name="country"]:checked').forEach((checkbox) => {
      formData.country.push(checkbox.value);
    });

    // Logic to collect selected seasons
    document.querySelectorAll('input[name="season"]:checked').forEach((checkbox) => {
      formData.show_season.push(checkbox.value);
    });

    // Logic to collect selected years
    document.querySelectorAll('input[name="year"]:checked').forEach((checkbox) => {
      formData.year.push(checkbox.value);
    });

    // Logic to collect selected types
    document.querySelectorAll('input[name="type"]:checked').forEach((checkbox) => {
      formData.show_type.push(checkbox.value);
    });

    // Logic to collect selected status
    document.querySelectorAll('input[name="status"]:checked').forEach((checkbox) => {
      formData.show_status.push(checkbox.value);
    });

    // Logic to collect selected languages
    document.querySelectorAll('input[name="language"]:checked').forEach((checkbox) => {
      formData.language.push(checkbox.value);
    });

    // Logic to collect selected ratings
    document.querySelectorAll('input[name="rating"]:checked').forEach((checkbox) => {
      formData.show_ratings.push(checkbox.value);
    });

    // Logic to collect selected watchlist value
    const excludeWatchlistCheckbox = document.getElementById('exclude_watchlist');
    formData.excludeWatchlist = excludeWatchlistCheckbox.checked ? [''] : [];

    // Use formData as needed (e.g., send it to the backend)
    console.log("Selected Data:", formData);

    fetch('http://localhost:8081/cards-filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You might need to include additional headers if required by your API
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
    fetchData(); // Call the fetchData function when the component mounts
    fetchRankData();
  }, []);
  
 
    const fetchRankData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/trending`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.success && Array.isArray(responseData.data) && responseData.data.length > 0) {
          const trendArray = responseData.data;
          console.log("trend data",trendArray);
          setTrendData(trendArray);
        } else {
          console.error('Unexpected data format:', responseData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  return (
    <>
      <Navbar />
      <div className="row">  
        <div className="filter-title">Filter</div>
        <div className="col md-9">
          <form className="filters" action="filter" autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault(); // Prevent the default form submission
              // Add any additional logic here, such as handling the dropdown options
              handleFormSubmit(e);
            }}
          >
            <div className="filter-row ">
              <div className="filter">
                <input
                  type="text"
                  className="form-control-search"
                  placeholder="Search..."
                  name="keyword"
                  value={keyword}
                  onChange={handleKeywordChange}
                />
              </div>
              {/* Genres dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn"
                    onClick={handleToggleGenres}
                  >
                    <span className="value" data-placeholder="Select genre" data-label-placement="true">
                      Select genre
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showGenres ? 'rotate-up' : 'rotate-down'}`}></i>
                  </button>

                  <div className={`noclose dropdown-menu lg c4 ${showGenres ? 'show' : ''}`}>
                    {/* Genres list */}
                    <ul className="genre-list">
                      <li><input type="checkbox" id="action" name="genre" value="action" /><label htmlFor="action">Action</label></li>
                      <li><input type="checkbox" id="adventure" name="genre" value="adventure" /><label htmlFor="adventure">Adventure</label></li>
                      <li><input type="checkbox" id="avant-garde" name="genre" value="avant-garde" /><label htmlFor="avant-garde">Avant Garde</label></li>
                      <li><input type="checkbox" id="boys-love" name="genre" value="boys-love" /><label htmlFor="boys-love">Boys Love</label></li>
                      <li><input type="checkbox" id="comedy" name="genre" value="comedy" /><label htmlFor="comedy">Comedy</label></li>
                      <li><input type="checkbox" id="demons" name="genre" value="demons" /><label htmlFor="demons">Demons</label></li>
                      <li><input type="checkbox" id="drama" name="genre" value="drama" /><label htmlFor="drama">Drama</label></li>
                      <li><input type="checkbox" id="ecchi" name="genre" value="ecchi" /><label htmlFor="ecchi">Ecchi</label></li>
                      <li><input type="checkbox" id="fantasy" name="genre" value="fantasy" /><label htmlFor="fantasy">Fantasy</label></li>
                      <li><input type="checkbox" id="girls-love" name="genre" value="girls-love" /><label htmlFor="girls-love">Girls Love</label></li>
                      <li><input type="checkbox" id="gourmet" name="genre" value="gourmet" /><label htmlFor="gourmet">Gourmet</label></li>
                      <li><input type="checkbox" id="harem" name="genre" value="harem" /><label htmlFor="harem">Harem</label></li>
                      <li><input type="checkbox" id="horror" name="genre" value="horror" /><label htmlFor="horror">Horror</label></li>
                      <li><input type="checkbox" id="isekai" name="genre" value="isekai" /><label htmlFor="isekai">Isekai</label></li>
                      <li><input type="checkbox" id="iyashikei" name="genre" value="iyashikei" /><label htmlFor="iyashikei">Iyashikei</label></li>
                      <li><input type="checkbox" id="josei" name="genre" value="josei" /><label htmlFor="josei">Josei</label></li>
                      <li><input type="checkbox" id="kids" name="genre" value="kids" /><label htmlFor="kids">Kids</label></li>
                      <li><input type="checkbox" id="magic" name="genre" value="magic" /><label htmlFor="magic">Magic</label></li>
                      <li><input type="checkbox" id="mahou-shoujo" name="genre" value="mahou-shoujo" /><label htmlFor="mahou-shoujo">Mahou Shoujo</label></li>
                      <li><input type="checkbox" id="martial-arts" name="genre" value="martial-arts" /><label htmlFor="martial-arts">Martial Arts</label></li>
                      <li><input type="checkbox" id="mecha" name="genre" value="mecha" /><label htmlFor="mecha">Mecha</label></li>
                      <li><input type="checkbox" id="military" name="genre" value="military" /><label htmlFor="military">Military</label></li>
                      <li><input type="checkbox" id="music" name="genre" value="music" /><label htmlFor="music">Music</label></li>
                      <li><input type="checkbox" id="mystery" name="genre" value="mystery" /><label htmlFor="mystery">Mystery</label></li>
                      <li><input type="checkbox" id="parody" name="genre" value="parody" /><label htmlFor="parody">Parody</label></li>
                      <li><input type="checkbox" id="psychological" name="genre" value="psychological" /><label htmlFor="psychological">Psychological</label></li>
                      <li><input type="checkbox" id="reverse-harem" name="genre" value="reverse-harem" /><label htmlFor="reverse-harem">Reverse Harem</label></li>
                      <li><input type="checkbox" id="romance" name="genre" value="romance" /><label htmlFor="romance">Romance</label></li>
                      <li><input type="checkbox" id="school" name="genre" value="school" /><label htmlFor="school">School</label></li>
                      <li><input type="checkbox" id="sci-fi" name="genre" value="sci-fi" /><label htmlFor="sci-fi">Sci-Fi</label></li>
                      <li><input type="checkbox" id="seinen" name="genre" value="seinen" /><label htmlFor="seinen">Seinen</label></li>
                      <li><input type="checkbox" id="shoujo" name="genre" value="shoujo" /><label htmlFor="shoujo">Shoujo</label></li>
                      <li><input type="checkbox" id="shounen" name="genre" value="shounen" /><label htmlFor="shounen">Shounen</label></li>
                      <li><input type="checkbox" id="slice-of-life" name="genre" value="slice-of-life" /><label htmlFor="slice-of-life">Slice of Life</label></li>
                      <li><input type="checkbox" id="space" name="genre" value="space" /><label htmlFor="space">Space</label></li>
                      <li><input type="checkbox" id="sports" name="genre" value="sports" /><label htmlFor="sports">Sports</label></li>
                      <li><input type="checkbox" id="super-power" name="genre" value="super-power" /><label htmlFor="super-power">Super Power</label></li>
                      <li><input type="checkbox" id="supernatural" name="genre" value="supernatural" /><label htmlFor="supernatural">Supernatural</label></li>
                      <li><input type="checkbox" id="suspense" name="genre" value="suspense" /><label htmlFor="suspense">Suspense</label></li>
                      <li><input type="checkbox" id="thriller" name="genre" value="thriller" /><label htmlFor="thriller">Thriller</label></li>
                      <li><input type="checkbox" id="vampire" name="genre" value="vampire" /><label htmlFor="vampire">Vampire</label></li>
                      <li><input type="checkbox" id="must-have-all" name="genre" value="must-have-all" /><label htmlFor="must-have-all">Must have all selected genres</label></li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Countries dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn  "
                    onClick={handleToggleCountries}
                  >
                    <span className="value" data-placeholder="Select country" data-label-placement="true">
                      Select country
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showCountries ? 'rotate-up' : 'rotate-down'}`}></i>
                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showCountries ? 'show' : ''}`}>

                    <ul className="genre-list">
                      <li><input type="checkbox" id="country_japan" name="country" value="Japan" /><label htmlFor="country_japan">Japan</label></li>
                      <li><input type="checkbox" id="country_china" name="country" value="China" /><label htmlFor="country_china">China</label></li>

                    </ul>

                  </div>
                </div>
              </div>

              {/* Seasons dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn  "
                    onClick={handleToggleSeasons}
                  >
                    <span className="value" data-placeholder="Select season" data-label-placement="true">
                      Select season
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showSeasons ? 'rotate-up' : 'rotate-down'}`}></i>

                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showSeasons ? 'show' : ''}`}>

                    <ul className="genre-list">
                      <li><input type="checkbox" id="season_fall" name="season" value="Fall" /><label htmlFor="season_fall">Fall</label></li>
                      <li><input type="checkbox" id="season_summer" name="season" value="Summer" /><label htmlFor="season_summer">Summer</label></li>
                      <li><input type="checkbox" id="season_spring" name="season" value="Spring" /><label htmlFor="season_spring">Spring</label></li>
                      <li><input type="checkbox" id="season_winter" name="season" value="Winter" /><label htmlFor="season_winter">Winter</label></li>
                      <li><input type="checkbox" id="season_unknown" name="season" value="Unknown" /><label htmlFor="season_unknown">Unknown</label></li>

                    </ul>

                  </div>
                </div>
              </div>
              {/* Years dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn  "
                    onClick={handleToggleYears}
                  >
                    <span className="value" data-placeholder="Select year" data-label-placement="true">
                      Select year
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showYears ? 'rotate-up' : 'rotate-down'}`}></i>

                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showYears ? 'show' : ''}`}>

                    <ul className="genre-list">
                      <li><input type="checkbox" id="year_2023" name="year" value="2023" /><label htmlFor="year_2023">2023</label></li>
                      <li><input type="checkbox" id="year_2022" name="year" value="2022" /><label htmlFor="year_2022">2022</label></li>
                      <li><input type="checkbox" id="year_2021" name="year" value="2021" /><label htmlFor="year_2021">2021</label></li>

                    </ul>

                  </div>
                </div>
              </div>
              {/* Types dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn  "
                    onClick={handleToggleTypes}
                  >
                    <span className="value" data-placeholder="Select type" data-label-placement="true">
                      Select type
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showTypes ? 'rotate-up' : 'rotate-down'}`}></i>

                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showTypes ? 'show' : ''}`}>

                    <ul className="genre-list">
                      <li><input type="checkbox" id="type_movie" name="type" value="Movie" /><label htmlFor="type_movie">Movie</label></li>
                      <li><input type="checkbox" id="type_tv" name="type" value="TV" /><label htmlFor="type_tv">TV</label></li>
                      <li><input type="checkbox" id="type_ova" name="type" value="OVA" /><label htmlFor="type_ova">OVA</label></li>
                      <li><input type="checkbox" id="type_ona" name="type" value="ONA" /><label htmlFor="type_ona">ONA</label></li>
                      <li><input type="checkbox" id="type_special" name="type" value="Special" /><label htmlFor="type_special">Special</label></li>
                      <li><input type="checkbox" id="type_music" name="type" value="Music" /><label htmlFor="type_music">Music</label></li>
                    </ul>

                  </div>
                </div>
              </div>


            </div>

            <div className="filter-row2">
              {/* Status dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn "
                    onClick={handleToggleStatus}
                  >
                    <span className="value" data-placeholder="Select status" data-label-placement="true">
                      Select status
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showStatus ? 'rotate-up' : 'rotate-down'}`}></i>

                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showStatus ? 'show' : ''}`}>
                    <ul className="genre-list">

                      <li><input type="checkbox" id="status_not_yet_aired" name="status" value="Not Yet Aired" /><label htmlFor="status_not_yet_aired">Not Yet Aired</label></li>
                      <li><input type="checkbox" id="status_releasing" name="status" value="Releasing" /><label htmlFor="status_releasing">Releasing</label></li>
                      <li><input type="checkbox" id="status_completed" name="status" value="Completed" /><label htmlFor="status_completed">Completed</label></li>
                    </ul>

                  </div>
                </div>
              </div>
              {/* Languages dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn  "
                    onClick={handleToggleLanguages}
                  >
                    <span className="value" data-placeholder="Select language" data-label-placement="true">
                      Select language
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showLanguages ? 'rotate-up' : 'rotate-down'}`}></i>

                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showLanguages ? 'show' : ''}`}>
                    <ul className="genre-list">
                      <li><input type="checkbox" id="language_sub_and_dub" name="language" value="Sub & Dub" /><label htmlFor="language_sub_and_dub">Sub & Dub</label></li>
                      <li><input type="checkbox" id="language_sub" name="language" value="Sub" /><label htmlFor="language_sub">Sub</label></li>
                      <li><input type="checkbox" id="language_s-sub" name="language" value="S-Sub" /><label htmlFor="language_s-sub">S-Sub</label></li>
                      <li><input type="checkbox" id="language_dub" name="language" value="Dub" /><label htmlFor="language_dub">Dub</label></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Rating dropdown */}
              <div className="filter">
                <div className="dropdown responsive">
                  <button
                    className="btn  "
                    onClick={handleToggleRating}
                  >
                    <span className="value" data-placeholder="Select rating" data-label-placement="true">
                      Select rating
                    </span>
                    <i className={`icon fa-solid fa-caret-down ${showRating ? 'rotate-up' : 'rotate-down'}`}></i>

                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${showRating ? 'show' : ''}`}>

                    <ul className="genre-list">
                      <li><input type="checkbox" id="rating_9" name="rating" value="9" /><label htmlFor="rating_9">9</label></li>
                      <li><input type="checkbox" id="rating_8" name="rating" value="8" /><label htmlFor="rating_8">8</label></li>
                      <li><input type="checkbox" id="rating_7" name="rating" value="7" /><label htmlFor="rating_7">7</label></li>

                    </ul>

                  </div>
                </div>
              </div>
              {/* Other filters and buttons */}
              {/* ... */}

              <div className="filter w-auto">
                <div className="dropdown responsive">
                  <button className="btn " data-toggle="dropdown" data-placeholder="false"
                    onClick={handleToggleWatchlist}>
                    <i className={`fa-solid fa-${excludeWatchlist ? 'toggle-off' : 'toggle-on'}`}></i>
                  </button>
                  <div className={`noclose dropdown-menu lg c4 ${excludeWatchlist ? 'show' : ''}`}>

                    <ul className="genre-list">
                      <li>
                        <input type="checkbox" id="exclude_watchlist" name="exclude_watchlist" value="0" />
                        <label htmlFor="exclude_watchlist" value="1" >Not in my watch list</label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="submit filter w-auto">
                <button type="submit" className="btn btn-purple d-flex align-items-center">
                  <i className="fa-solid fa-filter"></i>
                  <span className="ml-1">Filter</span>
                </button>
              </div>
            </div>
          </form>
          <div className="row filter-cards">

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
          </div>
        </div>
        <div className="col-md-3">
        <div className="filter-title2">Top rated </div>
        {trendData.map((trend) => (
            <TrendingBox key={trend.showid} ratings={trend.ratings} imageUrl={`/images/card-poster${trend.showid}.jpg`} title={trend.title} paraid={trend.id}/>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Genre;