/**
 * Created by federico.medina on 5/16/2015.
 */

(function(){

    "use strict";

    // Global variable CFC (Chinese Flash Cards)
    window.CFC = function() {

        // Constants
        var WORD_ENGLISH = 0,
            WORD_PINYIN = 1,
            WORD_CHINESE = 2;
        var NEXT_SHOW_ANSWER = 0,
            NEXT_NEW_WORD = 1;

        // DOM elements
        var playTime,
            fetchingData,
            guessWord,
            answerPinyin,
            answerChinese,
            btnShow;

        // Data
        var mDataSource,
            mIndexList = [],
            mDataElem,
            mNextState = NEXT_SHOW_ANSWER;

        function start(){

            // Gather DOM elements
            playTime = document.getElementById("playTime");
            fetchingData = document.getElementById("fetchingData");
            guessWord = document.getElementById("guessWord");
            answerPinyin = document.getElementById("answerPinyin");
            answerChinese = document.getElementById("answerChinese");
            btnShow = document.getElementById("btnShow");

            btnShow.addEventListener('click', function() {
                if (mNextState === NEXT_SHOW_ANSWER) {
                    mNextState = NEXT_NEW_WORD;
                    showAnswer();
                } else {
                    mNextState = NEXT_SHOW_ANSWER;
                    next();
                }
            });

            fetchData();
        }

        function fetchData() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "lang/chinese.json", true);
            xhr.onload = function() {
                setDataSource(JSON.parse(xhr.response));
                beginPlay();
            };
            xhr.onerror = function() {
                alert("Error fetching data.");
            };
            xhr.send();
        }

        function beginPlay() {
            fetchingData.style.display = "none";
            playTime.style.display = "block";
            next();
        }

        function setDataSource(dataSource) {

            mDataSource = [];

            // Iterate over all categories, add all words to a common list
            dataSource.categories.forEach(function(categoryData){
                var dataKey = categoryData[0];
                // var dataLabel = categoryData[1];

                var categoryWords = dataSource[dataKey];
                if (!categoryWords) {
                    return;
                }

                mDataSource = mDataSource.concat(categoryWords);
            });
        }

        function next() {

            if (mIndexList.length === 0) {
                randomizeIndexList();
            }

            var index = mIndexList.pop();
            mDataElem = mDataSource[index];

            guessWord.innerHTML = mDataElem[WORD_ENGLISH];
            answerPinyin.innerHTML = "";
            answerChinese.innerHTML = "";
        }

        function showAnswer() {
            answerPinyin.innerHTML = mDataElem[WORD_PINYIN];
            answerChinese.innerHTML = mDataElem[WORD_CHINESE];
        }

        function randomizeIndexList() {
            mIndexList = [];
            var indices = [];
            for (var i=0; i<mDataSource.length; ++i) {
                indices.push(i);
            }
            while (indices.length > 0) {
                var randIndex = Math.floor(Math.random() * indices.length);
                var randomIndexValue = indices[randIndex];
                mIndexList.push(randomIndexValue);
                indices.splice(randIndex, 1);
            }
        }


        return {
            start: start
        };
    }();

})();


