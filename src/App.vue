<template>
    <div id="main">
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
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
      paths: [
        {
          name: 'path-1',
          type: 'circle',
          x: 100,
          y: 100,
          radius: 70,
          rotation: 0,
          fill: "red",
          stroke: "black",
          strokeWidth: 4,
          draggable: true,
          strokeScaleEnabled: true
        },
        {
          name: 'path-2',
          type: 'rect',
          x: 20,
          y: 50,
          width: 100,
          height: 100,
          fill: 'red',
          shadowBlur: 10,
          draggable: true,
          strokeScaleEnabled: true
        }
      ]
    }
  },
  computed: mapState({
    'selectedShape': ({ selectedShape }) => selectedShape
  }),
   methods: {     
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

<style>
</style>
