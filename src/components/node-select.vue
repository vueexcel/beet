<template>
    <div class="row node-selector">
        <div class="col-2 p-0 text-center d-flex  justify-content-center">
            <span class="align-self-center">{{ $t('node_lbl') }}</span>
        </div>
        <div class="col-8 p-0">
            <div class="input-group mb-0">
                <select
                    id="node-select"
                    v-model="selectedNode"
                    class="form-control "
                >
                    <option
                        v-for="node in nodes"
                        :key="node.url"
                        :value="node.url"
                    >{{ node.url }}</option>
                </select>
            </div>
        </div>
        <div class="col-2 p-0 text-center d-flex  justify-content-center">
            <span
                class="status align-self-center"
                :class="{'icon-connected': isConnected,'icon-disconnected': !isConnected}"
            />
        </div>
    </div>
</template>

<script>
import getBlockchain from "../lib/blockchains/blockchainFactory"
import RendererLogger from "../lib/RendererLogger";

const logger = new RendererLogger();

export default {
  name: "NodeSelect",
  i18nOptions: { namespaces: "common" },
  data() {
    return {
      blockchain: getBlockchain(this.$store.state.WalletStore.wallet.chain),
      selectedNode: this.$store.state.SettingsStore.settings.selected_node[this.$store.state.WalletStore.wallet.chain],
      nodes: [],
      isConnected: false,
      api: null
    };
  },
  watch: {
    selectedNode: function(newVal, oldVal) {
      if (!!oldVal && oldVal !== newVal) {
          // this means user has actively changed the value
          this.blockchain.connect(this.selectedNode).then(() => {
              this._updateConnectionStatus();
              this.$store.dispatch("SettingsStore/setNode", {
                  chain: this.$store.state.WalletStore.wallet.chain,
                  node: this.selectedNode
              });
          }).catch((err) => {
              logger.error(err);
          });
      } else {
          // do nothing, as the value displayed is the already connected default node
      }

    }
  },
  mounted() {
    this.nodes = this.blockchain.getNodes();
    this.blockchain.connect(this.selectedNode).then((connectedNode) => {
      if (!this.selectedNode) {
        this.selectedNode = connectedNode;
      }
      this._updateConnectionStatus();
      this.$emit("first-connect");
    }).catch((err) => {
        logger.error(err);
    });
  },
  methods: {
    _updateConnectionStatus() {
      this.isConnected = this.blockchain.isConnected();
    },
  }
};
</script>
