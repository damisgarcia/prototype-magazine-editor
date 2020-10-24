<template>
    <v-layer>
        <v-rect 
            v-if="data.type === 'rect'" 
            :config="data" 
            @transformend="handleTransformEnd" 
        />
        <v-circle 
            v-else-if="data.type === 'circle'" 
            :config="data" 
            @transformend="handleTransformEnd" 
        />
        <v-transformer ref="transformer" />
    </v-layer>
</template>

<script>
import Konva from 'konva'
import { mapState } from 'vuex'

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: mapState({
        selectedShape: ({ selectedShape }) => selectedShape
    }),
    watch: {
        selectedShape(newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal === this.data.name) {
                    return this.updateTransformer()
                } else {
                    return this.removeTransformer()
                }
            }
        }
    },
    methods: {
        handleTransformEnd(e) {
            // update the state
            this.data.x = e.target.x();
            this.data.y = e.target.y();
            this.data.rotation = e.target.rotation();
            this.data.scaleX = e.target.scaleX();
            this.data.scaleY = e.target.scaleY();

            // change fill
            this.data.fill = Konva.Util.getRandomColor();
        },
        updateTransformer() {
            // here we need to manually attach or detach Transformer node
            const transformer = this.$refs.transformer
            const transformerNode = transformer.getNode()
            const stage = transformerNode.getStage()
            const { selectedShape } = this

            const selectedNode = stage.findOne('.' + selectedShape)
            
            // do nothing if selected node is already attached
            if (selectedNode === transformerNode.node()) {
                return
            }

            if (selectedNode) {
                // attach to another node
                transformerNode.nodes([selectedNode])
            } else {
                // remove transformer
                this.removeTransformer()
            }
            transformerNode.getLayer().batchDraw()
        },
        removeTransformer() {
            const transformer = this.$refs.transformer
            const transformerNode = transformer.getNode()

            transformerNode.nodes([])
            transformerNode.getLayer().batchDraw()
        },
    },
}
</script>

<style>

</style>