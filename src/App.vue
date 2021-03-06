<template>
    <div id="main">
        <div class="pages">
            <div class="canvas" v-if="page">
                <v-stage 
                    ref="stage" 
                    :config="configKonva" 
                    @mousedown="handleStageMouseDown"
                    @touchstart="handleStageMouseDown"
                >
                    <v-layer>
                        <v-image
                            :config="{id: 'background', image: page.background}" 
                        />
                    </v-layer>
                    <CanvasPath 
                        v-for="path in page.paths" 
                        :key="path.name" 
                        :id="path.name" 
                        :data="path"
                        @change="onChangeElement"
                    />
                </v-stage>
            </div>
        </div>
        <div class="tools">
            <div class="buttons">
                <div class="button-group">
                    <button @click="newPage">Criar Página</button>
                    <button @click="removePage">Remover Página Atual</button>

                </div>
                <div class="button-group">
                    <button @click="nextPage">Próxima Página</button>
                    <button @click="prevPage">Voltar Página</button>
                </div>
            </div>
            <h1>Protótipo criador de quadrinho</h1>
            <div class="elements">
                <h3>Objetos</h3>
                <div class="elements-search">
                    <input placeholder="Buscar imagem" v-model="query" />
                </div>
                <div class="elements-list">
                    <div class="element" v-for="element in filteredElements" :key="element.name" @click.stop="() => addElement(element)">
                        <img :src="element.imageSrc" :title="element.title" />
                    </div>
                </div>
                <button v-if="selectedShape" @click="removeElement">
                    Apagar Elemento
                </button>
            </div>
            <div class="backgrounds">
                <h3>Fundos</h3>
                <div class="elements-search">
                    <input placeholder="Buscar por fundo" v-model="backgroundQuery" />
                </div>
                <div class="elements-list">
                    <div class="element" v-for="bg in filteredBackgrounds" :key="bg.title" @click.stop="() => addBackground(bg)">
                        <img :src="bg.src" :title="bg.title" />
                    </div>
                </div>
            </div>            
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

import CanvasPath from './components/CanvasPath'

export default {
  components: {
    CanvasPath
  },
  data() {
    return {
      configKonva: {
        width: window.innerWidth,
        height: window.innerHeight / 2
      },
      query: '',
      background: null,
      backgrounds: [
          {
              title: 'Montanha',
              src: require('./assets/bgs/01.webp'),
          },
          {
              title: 'Praia',
              src: require('./assets/bgs/02.webp'),
          },
          {
              title: 'Verão',
              src: require('./assets/bgs/03.webp'),
          }
      ],
      backgroundQuery: '',
      elements: [
          {
            title: 'Bola',
            name: 'image-1',
            type: 'image',
            image: null,
            imageSrc: require('./assets/imagens/ball.jpg'),
            x: 24,
            y: 24,
            rotation: 0,
            draggable: true
          },
          {
            title: 'Vuejs',
            name: 'image-2',
            type: 'image',
            image: null,
            imageSrc: require('./assets/logo.png'),
            x: 24,
            y: 24,
            rotation: 0,
            draggable: true
          },
          {
            title: 'Mestre Yoda',
            name: 'image-3',
            type: 'image',
            image: null,
            imageSrc: 'https://konvajs.org/assets/yoda.jpg',
            x: 24,
            y: 24,
            rotation: 0,
            draggable: true
          },
          {
            title: 'Balloon',
            name: 'image-4',
            type: 'image',
            variant: 'balloon',
            text: 'Insira seu texto aqui lorema sadsda',
            image: null,
            imageSrc: require('./assets/ballons/balloon.png'),
            width: 125,
            height: 100,
            draggable: true,
            fontSize: 14,
            padding: 8,
          }
      ],      
    }
  },
  computed: {
    page() {
        return this.$store.getters.currentPage
    },
    filteredElements() {
        return this.elements.filter((ele) => {
            const query = this.query.toLowerCase()
            return ele.title.toLowerCase().includes(query)
        })
    },
    filteredBackgrounds() {
        return this.backgrounds.filter((ele) => {
            const query = this.backgroundQuery.toLowerCase()
            return ele.title.toLowerCase().includes(query)
        })
    },
    ...mapState({
        'pages': (state) => state.pages,
        'selectedShape': (state) => state.selectedShape
    })
  },
  mounted() {
      this.newPage()
  },
   methods: {
    addElement(element) {
        this.page.paths.push({ ...element, name: uuidv4() })
    },
    addBackground(background){
        const image = new Image()
        
        image.onload = () => {
            this.page.background = image
        }

        image.src = background.src
    },
    removeElement() {
        const pathIndex = this.page.paths.findIndex((path) => path.name === this.selectedShape)
        this.page.paths.splice(pathIndex, 1)
        this.selectShape(null)
    },
    handleStageMouseDown({ target }) {        
        const stage = target.getStage()
        const group = target.parent?.nodeType === 'Group' ? target.parent : null

        // clicked on stage - clear selection
        if (target.nodeType === stage.nodeType || target.attrs.id === 'background') {
            this.selectShape(null)
            return
        }

        // find clicked rect by its name
        const name = group?.name() || target.name()
        const path = this.page.paths.find((r) => r.name === name)

        if (path) {
            this.selectShape(name)
        }
    },
    onChangeElement() {
        console.log(this.page)
        this.updatePage(this.page)
    },
    ...mapActions([
        'newPage',
        'removePage',
        'updatePage',
        'nextPage',
        'prevPage',
        'selectShape'
    ])
  }
}
</script>

<style lang="scss">
@import url("https://cdn.jsdelivr.net/gh/jgthms/minireset.css@master/minireset.min.css");
#main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    h1 {
        font-size: 24px;
        font-weight: bold;
    }
    .pages, .tools {
        flex: 1;
    }
    .tools {
        padding: 1rem 1.5rem;
    }
    .elements {
        margin-bottom: 3rem;
        &-list {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            flex-wrap: wrap;
            .element {
                padding: 1rem;
                max-width: 25%;
                &:not(:last-child) {
                    margin-right: 2rem;
                }
                &:hover, 
                &:focus, 
                &:active {
                    cursor: pointer;
                    border: 1px solid orange;
                }
            }
        }
    }
    .buttons {
        display: flex;
        .button-group {
            flex: 1;
            button:not(:last-child) {
                margin-right: 1rem;
            }
        }        
    }
}
</style>
