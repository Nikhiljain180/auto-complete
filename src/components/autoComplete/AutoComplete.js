import React from 'react';
import './AutoComplete.css';
import {apikey, url} from "./Constant";
import clear from '../../clear.svg'
import {debounce} from 'throttle-debounce';


class AutoComplete extends React.Component {

    constructor(props) {
        super(props);
        this.autocompleteSearchDebounced = debounce(500, this.autoCompleteSearch);

        document.addEventListener('click', (event) => {
            if (event.target === this.pageNode) {
                this.setState({searchData: []});
                this.SearchComponentRevertChanges();
            }
        })
    }

    static getDerivedStateFromError() {
        return {
            searchData: []
        }
    }

    state = {
        searchData: [],
        selectedData: [],
        autoSearchVal: ''
    };

    userInput(value) {
        this.setState({autoSearchVal: value}, () => {
            this.autocompleteSearchDebounced(this.state.value);
        });
    }

    autoCompleteSearch() {
        let fetchInitialData = async () => {
            let fetchUrl = `${url}?&apikey=${apikey}&s=${this.state.autoSearchVal}`;
            const result = await fetch(fetchUrl).then(
                response => response.json()
            );

            if (result.Search) {
                let searchData = result.Search.filter((serchdata) => {
                    let searchFlag = true;
                    for (let i = 0; i < this.state.selectedData.length; i++) {
                        if (serchdata.Title === this.state.selectedData[i].Title) {
                            searchFlag = false;
                        }
                    }
                    return searchFlag
                });
                this.setState({searchData: searchData})
            } else {
                this.setState({searchData: []})
            }
        };
        fetchInitialData().then();
    }

    selectMovie(searchResult) {

        this.setState({
            selectedData: [...this.state.selectedData, searchResult],
            autoSearchVal: '',
            searchData: []
        });
        this.SearchComponentRevertChanges();
    }

    clearSelectedSuggestion(index) {
        let selectedData = this.state.selectedData;
        selectedData.splice(index, 1);
        this.setState({selectedData});
    }

    SearchComponentRevertChanges() {
        this.searchNode.value = '';
        this.searchNode.focus();
    }

    render() {
        return (
            <div className="autoCompleteContainer"
                 ref={(event) => this.pageNode = event}
            >
                <div className="userSelectedDiv">
                    {
                        this.state.selectedData && this.state.selectedData.map((selectedData, index) => {
                            return (
                                <div key={selectedData.imdbID} className="selectedDiv">
                                    <div className="label">{selectedData.Title}</div>
                                    <div className="img">
                                        <img alt='clear' onClick={() => this.clearSelectedSuggestion(index)}
                                             src={clear}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="searchContainer">
                        <input onChange={(ev) => this.userInput(ev.target.value)}
                               ref={(event) => this.searchNode = event}
                               className="searchField"
                               type="text"
                        />

                        {
                            this.state.searchData.length > 0 &&
                            <div className="resultContainerDiv">
                                {
                                    this.state.searchData.map((searchResult, index) => (

                                        <div onClick={() => {
                                            (this.props.maxAllowedSearch > this.state.selectedData.length) &&
                                            this.selectMovie(searchResult)
                                        }}
                                             key={searchResult.imdbID}
                                             className="searchresult"
                                        >
                                            <div className="imageBlock">
                                                {
                                                    (searchResult.Poster && (searchResult.Poster !== 'N/A')) &&
                                                    <img alt={searchResult.Poster} src={searchResult.Poster}/>
                                                }
                                            </div>
                                            <div className="furtherInfo">
                                                <div className="title">{searchResult.Title}</div>
                                                <div className="year">{searchResult.Year}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default AutoComplete;
