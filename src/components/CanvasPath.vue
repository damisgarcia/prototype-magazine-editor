<template>
    <v-layer ref="layer">
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
        <v-image
            v-else-if="data.type === 'image'" 
            :config="data" 
            @transformend="handleTransformEnd"  
        />
        <v-transformer ref="transformer" />
    </v-layer>
</template>

<script>
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
                newVal === this.data.name
                    ? this.updateTransformer()
                    : this.removeTransformer()
            }
        }
    },
    mounted() {
        if (this.data.type === 'image') {
            const image = new Image()                        
            
            image.src = this.data.imageSrc
            image.onload = () => {
                this.data.image = image                
            }
        }
    },
    methods: {
        handleTransformEnd(e) {
            // sincronizando mudanças
            this.data.x = e.target.x();
            this.data.y = e.target.y();
            this.data.rotation = e.target.rotation();
            this.data.scaleX = e.target.scaleX();
            this.data.scaleY = e.target.scaleY();
        },
        updateTransformer() {
            // ativando transformer
            const transformer = this.$refs.transformer
            const transformerNode = transformer.getNode()
            const stage = transformerNode.getStage()
            const { selectedShape } = this

            const selectedNode = stage.findOne('.' + selectedShape)
            
            if (selectedNode === transformerNode.node()) {
                return
            }

            if (selectedNode) {
                // adicionado ao transformer layer
                transformerNode.nodes([selectedNode])
            } else {
                this.removeTransformer()
            }

            // aplicando no canvas transformer
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