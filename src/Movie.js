import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import querystring from "querystring";
import "./Movie.css";

class Movie extends React.Component {
    KOBIS_KEY = 'cee131d2c40a9e5dcfbfe96eabc5aab9';

    KOBIS_MOVIE_URI = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json';

    TMDB_KEY = '426d65cfa3cf702b8ab8816512b9931a';

    TMDB_SEARCH_URI = 'https://api.themoviedb.org/3/search/movie';

    TMDB_POSTER_URI = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

    state = {};

    getMovie = async () => {
        const {
            data: {
                movieInfoResult: { movieInfo }
            }
        } = await axios.get(
            `${this.KOBIS_MOVIE_URI}?${querystring.stringify({
                key: this.KOBIS_KEY,
                movieCd: this.props.id
            })}`
        );

        const { data: { results } } = await axios.get(
            `${this.TMDB_SEARCH_URI}?${querystring.stringify({
                api_key: this.TMDB_KEY,
                language: 'ko-KR',
                query: movieInfo.movieNm,
                year: moment(movieInfo.openDt).format('YYYY')
            })}`
        );

        movieInfo['poster'] = this.TMDB_POSTER_URI + results[0].poster_path;

        this.parseInfo(movieInfo);
    };

    parseInfo = (movie) => {
        this.setState({
            title: movie.movieNm,
            subtitle: movie.movieNmEn,
            openAt: moment(movie.openDt).format('YYYY-MM-DD'),
            status: movie.prdtStatNm,
            audits: movie.audits[0].watchGradeNm,
            showTimes: `${movie.showTm}분`,
            nations: movie.nations[0].nationNm,
            directors: movie.directors.map(director => director.peopleNm).join(' / '),
            genres: movie.genres.map(genre => genre.genreNm).join('/'),
            distributor: movie.companys.filter(company => company.companyPartNm === '배급사').map(company => company.companyNm).join(', '),
            poster: movie.poster
        });
    };

    componentDidMount() {
        this.getMovie();
    }

    render() {
        return (
            <a className="movie" href={`https://search.naver.com/search.naver?${encodeURI(`sm=top_hty&fbm=1&ie=utf8&query=${this.state.title}`)}`} target="_blank" rel="noopener noreferrer">
                <img src={this.state.poster} alt={this.state.title} />

                <div className="movie__data">
                    <div className="movie__header">
                        <h4 className="movie__title">{this.state.title}</h4>
                        <h5 className="movie__subtitle">{this.state.subtitle}</h5>
                    </div>

                    <div className="movie__info">
                        <p className="movie__openat">
                            <span>개봉일</span> {this.state.openAt}
                        </p>

                        <p className="movie__status">
                            <span>제작상태</span> {this.state.status}
                        </p>
                    </div>

                    <div className="movie__info">
                        <p className="movie__audits">
                            <span>관람등급</span> {this.state.audits}
                        </p>

                        <p className="movie__showtimes">
                            <span>상영시간</span> {this.state.showTimes}
                        </p>

                        <p className="movie__nations">
                            <span>제작국가</span> {this.state.nations}
                        </p>
                    </div>

                    <div className="movie__info">
                        <p className="movie__directors">
                            <span>감독</span> {this.state.directors}
                        </p>

                        <p className="movie__genres">
                            <span>장르</span> {this.state.genres}
                        </p>

                        <p className="movie__distributor">
                            <span>배급사</span> {this.state.distributor}
                        </p>
                    </div>
                </div>
            </a>
        );
    }
}

Movie.propTypes = {
    id: PropTypes.string.isRequired
};

export default Movie;