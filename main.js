import "https://cdn.skypack.dev/preact/debug";
import { h, render } from "https://cdn.skypack.dev/preact";
import {
    useEffect,
    useState,
    useRef,
} from "https://cdn.skypack.dev/preact/hooks";

import htm from "https://cdn.skypack.dev/htm";
const html = htm.bind(h);

import Login from "./login.js";
import Home from "./home.js";
import Search from "./search.js";
import Borrow from "./borrow.js";

import WebSocket from 'https://cdn.skypack.dev/isomorphic-ws';


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    getRedirectResult,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKyQWZ6hsQ6xyIMZGsriZgoZlGTU1RgTQ",
    authDomain: "greenhub-9c7d3.firebaseapp.com",
    projectId: "greenhub-9c7d3",
    storageBucket: "greenhub-9c7d3.appspot.com",
    messagingSenderId: "889263093307",
    appId: "1:889263093307:web:62b77b2338b5a7eb28ce1e",
};

const Main = () => {
    //useStates for routing
    const app = useRef(initializeApp(firebaseConfig));
    const user = useRef(null);
    const [currentPage, setCurrentPage] = useState("HOME");
    const [isLoading, setIsLoading] = useState(true);
    const ws = useRef(null);
    const _URL = new URL(document.location);
    const _GET = _URL.searchParams;
    const URL_TARGET = _GET.get("id");

    useEffect(() => {
        const auth = getAuth(app.current);
        getRedirectResult(auth)
            .then((result) => {
                console.log(result);
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                if (result.user !== null) {
                    user.current = result.user;
                    setCurrentPage("HOME");
                }
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        ws.current = new WebSocket('wss://greenhub.slmaaa.work/ws/user_db/qr');
        ws.current.onopen = () => {
            console.log('opened');
        }
        ws.current.onclose = () => {
            console.log('closed')
        }
    }, [])

    useEffect(() => {
        console.log(currentPage);
    }, [currentPage]);

    if (isLoading) {
        return html `<p>Loading...</p>`;
    }
    let scene;
    switch (currentPage) {
        case "LOGIN":
            scene = html `<${Login} setCurrentPage=${setCurrentPage} app=${app} />`;
            break;
        case "HOME":
            scene = html `<${Home} setCurrentPage=${setCurrentPage} user=${user} currentPage=${currentPage} />`;
            break;
        case "SEARCH":
            scene = html `<${Search} setCurrentPage=${setCurrentPage} currentPage=${currentPage} />`;
            break;
        case "BORROW":
            scene = html `<${Borrow} setCurrentPage=${setCurrentPage} currentPage=${currentPage} />`;
            break;
    }
    return scene;
};

render(html `<${Main} />`, document.body);