<template>
    <div id="main">
        <div class="canvas">
            <v-stage 
                ref="stage" 
                :config="configKonva" 
                @mousedown="handleStageMouseDown"
                @touchstart="handleStageMouseDown"
            >

                <CanvasPath 
                    v-for="path in paths" 
                    :key="path.name" 
                    :id="path.name" 
                    :data="path" 
                />
            </v-stage>
        </div>
        <div class="tools">
            <h1>Protótipo criador de quadrinho</h1>
            <div class="elements">
                <div class="elements-search">
                    <input placeholder="Buscar imagem" v-model="query" />
                </div>
                <div class="elements-list">
                    <div class="element" v-for="element in filteredElements" :key="element.name" @click.stop="() => addElement(element)">
                        <img :src="element.imageSrc" :title="element.title" />
                    </div>
                </div>
            </div>
            <button v-if="selectedShape" @click="removeElement">
                Apagar Elemento
            </button>
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
          }
      ],
      paths: [          
      ]
    }
  },
  computed: {      
    filteredElements() {
        return this.elements.filter((ele) => {
            const query = this.query.toLowerCase()
            return ele.title.toLowerCase().includes(query)
        })
    },
    ...mapState({
        'selectedShape': ({ selectedShape }) => selectedShape
    })
  },
   methods: {
    addElement(element) {
        this.paths.push({ ...element, name: uuidv4() })
    },
    removeElement() {
        const pathIndex = this.paths.findIndex((path) => path.name === this.selectedShape)
        this.paths.splice(pathIndex, 1)
        this.selectShape(null)
    },
    handleStageMouseDown(e) {
        // clicked on stage - clear selection
        if (e.target.nodeType === e.target.getStage().nodeType) {
            this.selectShape(null)
            return
        }

        // find clicked rect by its name
        const name = e.target.name()
        const path = this.paths.find((r) => r.name === name)

        if (path) {
            this.selectShape(name)
        }
    },
    ...mapActions(['selectShape'])
  }
}
</script>

<style lang="scss">
@import url("https://cdn.jsdelivr.net/gh/jgthms/minireset.css@master/minireset.min.css");
#main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    h1 {
        font-size: 24px;
        font-weight: bold;
    }
    .canvas, .tools {
        flex: 1;
    }
    .tools {
        padding: 1rem 1.5rem;
    }
    .elements {
        &-list {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            .element {
                padding: 1rem;
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
}
</style>
