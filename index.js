/* import tweetsData from another file & uuiv4,
set up html type="module",
delete tweetsData array below, and
change the uuid in handleTweetBtnClick()
when local server set upped
*/

let tweetsData = [   
    {
        handle: `@TrollBot66756542 💎`,
        profilePic: `images/troll.jpg`,
        likes: 27,
        retweets: 10,
        tweetText: `Buy Bitcoin, ETH Make 💰💰💰 low low prices. 
            Guaranteed return on investment. HMU DMs open!!`,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: '4b161eee-c0f5-4545-9c4b-8562944223ee',
    },    
    {
        handle: `@Elon ✅`,
        profilePic: `images/musk.png`,
        likes: 6500,
        retweets: 234,
        tweetText: `I need volunteers for a one-way mission to Mars 🪐. No experience necessary🚀`,
        replies: [
                  {
                handle: `@TomCruise ✅`,
                profilePic: `images/tcruise.png`,
                tweetText: `Yes! Sign me up! 😎🛩`,
            },
                  {
                handle: `@ChuckNorris ✅`,
                profilePic: `images/chucknorris.jpeg`,
                tweetText: `I went last year😴`,
            },
        ],
        isLiked: false,
        isRetweeted: false,
        uuid: '3c23454ee-c0f5-9g9g-9c4b-77835tgs2',
    },
        {
        handle: `@NoobCoder12`,
        profilePic: `images/flower.png`,
        likes: 10,
        retweets: 3,
        tweetText: `Are you a coder if you only know HTML?`,
        replies: [
            {
                handle: `@StackOverflower ☣️`,
                profilePic: `images/overflow.png`,
                tweetText: `No. Obviosuly not. Go get a job in McDonald's.`,
            },
            {
                handle: `@YummyCoder64`,
                profilePic: `images/love.png`,
                tweetText: `You are wonderful just as you are! ❤️`,
            },
        ],
        isLiked: false,
        isRetweeted: false,
        uuid: '8hy671sff-c0f5-4545-9c4b-1237gyys45',
    },     
]

if(localStorage.tweetsData){
    tweetsData = JSON.parse(localStorage.getItem("tweetsData"))
}    

const optionsModal = document.getElementById("options-modal")

// eventListeners and funtions they invokes
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyEvent(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetEvent()
    }
    else if(e.target.classList.contains("fa-angle-down")){
        showOptionsModal(e, e.target.dataset.tweetoptions)
    }
    else if(!e.target.closest("#options-modal")){
        optionsModal.style.display = "none"
    }
    else if(e.target.closest("#options-modal")){
        deleteTweet()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyEvent(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetEvent(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: `${Math.random()}`
        })
    render()
    tweetInput.value = ''
    }

}

function showOptionsModal(e, tweetId) {
    Object.assign(optionsModal.style, {
        left: `${(e.pageX)-140}px`,
        top: `${e.pageY}px`,
        display: "block",
    })
    optionsModal.dataset.modal = tweetId
}

function deleteTweet(){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === optionsModal.dataset.modal
    })[0]    
    const tweetIndex = tweetsData.indexOf(targetTweetObj)
    tweetsData.splice(tweetIndex, 1)
    optionsModal.style.display = "none"
    render()
}

document.addEventListener('keydown', function(e){
    if (e.code === 'Enter' && !e.shiftKey && e.target.id === 'tweet-input') {
        e.preventDefault()
        handleTweetEvent()
    }
    else if (e.code === 'Enter' && !e.shiftKey && e.target.dataset.input) {
        e.preventDefault()
        addReply(e.target.dataset.input)
    }
})

function addReply(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const tweetIndex = tweetsData.indexOf(targetTweetObj)
    const inputOfReply = document.querySelector(`[data-input='${tweetId}']`)
    
    tweetsData[tweetIndex].replies.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: inputOfReply.value,
    },)

    render()
    handleReplyEvent(tweetId)
}

function escapeHtml(unsafe){
    return (unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    );
 }

// generating and rendering posts
function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){         
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <span class="tweet-header">
                                <p class="handle">${reply.handle}</p>
                                <i class="fa-solid fa-angle-down"
                                data-tweetoptions="${tweet.uuid}"
                                ></i>
                            </span>
                            <p class="tweet-text">
                                ${escapeHtml(reply.tweetText).replace(/\n\r?/g, '<br />')}
                            </p>
                        </div>
                    </div>
                </div>
                `
            })
        }

        let tweetOptionsClass = ''
        if (tweet.handle !== `@Scrimba`){
            tweetOptionsClass = 'hidden'
        }

        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <span class="tweet-header">
                        <p class="handle">${tweet.handle}</p>
                        <i class="fa-solid fa-angle-down ${tweetOptionsClass}"
                        data-tweetoptions="${tweet.uuid}"
                        ></i>
                    </span>
                    <p class="tweet-text">
                        ${escapeHtml(tweet.tweetText).replace(/\n\r?/g, '<br />')}
                    </p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                <div id="reply-area">    
                    <div class="tweet-inner">
                            <img src="images/scrimbalogo.png" class="profile-pic">
                            <textarea placeholder="Tweet your reply" class="reply-input" data-input="${tweet.uuid}"></textarea>
                    </div>
                </div>
                ${repliesHtml}
            </div>
        </div>
        `
    })
    return feedHtml
}

function render(){
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
localStorage.clear()