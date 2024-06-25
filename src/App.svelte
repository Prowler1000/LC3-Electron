<script lang="ts">
  import "./app.css"
  import Workspace from "./presentation/Workspace.svelte";
  import Header from "./components/Header.svelte";
</script>

<main>
  <Header />
  <Workspace />
</main>

<style>
  #content{
        height: inherit;
        width: inherit;
        position: relative;
    }

    #help{
        height: 70vh;
        width: 65vw;
        position: absolute;
        z-index: 15;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        justify-items: center;
        align-items: center;
    }

    #modal{
        position: absolute;
        z-index: 14;
        top: 0;
        left: 0;
        height: 100%;
        width: 100vw;
        cursor: pointer;
        background-color: rgba(0,0,0,0.2);
    }

    #help-inner{
        position: relative;
        height: 88%;
        width: 85%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #buttonSet{
        z-index: 5;
        position: absolute;
        top: 2%;
        right: 10%;
        display: flex;
    }

    #buttonSet button span{
        transform: scale(1.4);
    }

    #prevBtn, #nextBtn{
        height: 3em;
        width: 3em;
        border-radius: 50%;
        font-size: 30px;
        display: grid;
        justify-items: center;
        align-items: center;
        margin-left: 1em;
        border-width: 3px;
    }

    #docContent{
        z-index: 4;
        height: 59vh;
        width: 100%;
        overflow-y: scroll;
    }

    .note{
        height: max-content;
        width: 100%;
        text-align: right;
        font-size: 10px;
        margin-bottom: 3vh;
        background: unset;
        padding: unset;
        border: unset;
    }

    @media (max-width: 1300px) {
        #modal{
            height: 170vh;
        }

        #docContent{
            height: 80vh;
        }
        
        #help{
            height: 90vh;
            width: 80vw;
        }
    }

    @media (max-width: 1000px) {
        #buttonSet button span{
            transform: scale(1.3);
        }

        #prevBtn, #nextBtn{
            height: 2em;
            width: 2em;
            border-width: 2px;
        }
    }

    @media (max-width: 600px) {
        #buttonSet{
            top: -5%;
            left: 50%;
            transform: translateX(-45%);
        }

        #buttonSet button span{
            transform: scale(1);
        }

        #prevBtn, #nextBtn{
            height: 1.6em;
            width: 1.6em;
            margin: 0.2em;
        }
    }
</style>
