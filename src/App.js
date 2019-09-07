import React from "react";
import axios from "axios";
import Movie from "./Movie";
import moment from "moment";
import querystring from "querystring";
import "./App.css";

class App extends React.Component {
    KOBIS_KEY = 'cee131d2c40a9e5dcfbfe96eabc5aab9';

    KOBIS_BOX_OFFICE_URI = '//www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json';

    state = {
        isLoading: true,
        movies: []
    };

    getMovies = async () => {
        const yestersday = moment().subtract(1, 'days').format('YYYYMMDD');

        const {
            data: {
                boxOfficeResult: { dailyBoxOfficeList }
            }
        } = await axios.get(
            `${this.KOBIS_BOX_OFFICE_URI}?${querystring.stringify({ 
                key: this.KOBIS_KEY,
                targetDt: yestersday,
                repNationCd: 'K'
            })}`
        );

        this.setState({
            movies: dailyBoxOfficeList,
            isLoading: false
        })
    };

    componentDidMount() {
        this.getMovies();
    }

    render() {
        const { isLoading, movies } = this.state;

        return (
            <section className="container">
                {isLoading
                    ? (
                        <div className="loader">
                            <span className="loader__text">Loading...</span>
                        </div>
                    )
                    : (
                        <div className="movies">
                            {movies.map((movie, index) =>
                                <Movie key={index} id={movie.movieCd} />
                            )}
                        </div>
                    )
                }
            </section>
        );
    }
}

export default App;
