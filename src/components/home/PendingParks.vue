<template>
  <div>
    <template v-if="parksAwaitingSubmission && parksAwaitingSubmission.length">
      <h2 class="title is-5">
        Created parks
      </h2>
      <h3 class="subtitle is-6">
        Finish editing these parks and submit them for review!
      </h3>
      <ul class="columns is-multiline">
        <li
            v-for="parkRequest in parksAwaitingSubmission"
            :key="parkRequest.id"
            class="column is-3"
        >
          <ParkCard
              :park="parkRequest.park"
          >
            <RouterLink :to="{name: 'park-editor', params: {id: parkRequest.id}}">
              <BIcon icon="edit" />
              {{ parkRequest.park.name || 'Untitled' }}
            </RouterLink>
          </ParkCard>
        </li>
      </ul>
      <hr>
    </template>
    <template v-if="parksAwaitingAcceptance && parksAwaitingAcceptance.length">
      <h2 class="title is-5">
        Submitted parks
      </h2>
      <h3 class="subtitle is-6">
        We're reviewing these before adding them to our park list.
      </h3>
      <ul class="columns is-multiline">
        <li
            v-for="parkRequest in parksAwaitingAcceptance"
            :key="parkRequest.id"
            class="column is-3"
        >
          <ParkCard
              :park="parkRequest.park"
          >
            <div class="is-flex-grow-1">
              <div class="is-flex is-justify-content-space-between is-align-items-center">
                <p class="has-text-weight-bold">{{ parkRequest.park.name }}</p>
                <BTag
                    class="has-text-weight-bold"
                    type="is-info"
                >
                  {{ parkRequest.status }}
                </BTag>
              </div>
              <b-message
                  v-show="parkRequest.statusMessage"
                  size="is-small"
                  class="mt-2"
              >
                Status message: <strong>{{ parkRequest.statusMessage }}</strong>
              </b-message>
            </div>
          </ParkCard>
        </li>
      </ul>
    </template>
  </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {ParkRequest} from '@/types';
import ParkCard from '@/components/park/ParkCard.vue';

@Component({
  components: {ParkCard},
})
export default class PendingParks extends Vue {
  @Prop({type: Array, default: []}) private readonly pendingParks!: ParkRequest[];

  get parksAwaitingSubmission() {
    return this.pendingParks.filter(e => !e.submitted);
  }

  get parksAwaitingAcceptance() {
    return this.pendingParks.filter(e => e.submitted);
  }
}
</script>
