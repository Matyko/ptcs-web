<template>
  <div class="p-4">
    <h2 class="title is-5">Park Requests</h2>
    <BTable
        :data="parkRequests"
        paginated
        per-page="10"
    >
      <BTableColumn label="ID">
        <template v-slot="{ row }">
          <BTag>{{ row.id }}</BTag>
        </template>
      </BTableColumn>
      <BTableColumn label="Name">
        <template v-slot="{ row }">
          {{ row.park.name }}
        </template>
      </BTableColumn>
      <BTableColumn
          centered
          label="Status"
      >
        <template v-slot="{ row }">
          <BTag
              class="is-capitalized"
              type="is-info"
          >
            status:
            <b>
              {{ row.status }}
            </b>
          </BTag>
        </template>
      </BTableColumn>
      <BTableColumn
          label="Created at"
          numeric
      >
        <template v-slot="{ row }">
          {{ row.createdAt | formatDate }}
        </template>
      </BTableColumn>
      <BTableColumn
          label="Actions"
          numeric
      >
        <template v-slot="{ row }">
          <RouterLink
              :to="{ name: 'park-editor', params: { id: row.id }}"
              class="button is-primary is-small"
          >
            <strong>View</strong>
          </RouterLink>
        </template>
      </BTableColumn>
    </BTable>
    <hr>
    <h2 class="title is-5">Parks</h2>
    <BTable
        :data="parks"
        paginated
        per-page="10"
    >
      <BTableColumn label="ID">
        <template v-slot="{ row }">
          <BTag>{{ row.id }}</BTag>
        </template>
      </BTableColumn>
      <BTableColumn label="Name">
        <template v-slot="{ row }">
          {{ row.name }}
        </template>
      </BTableColumn>
      <BTableColumn
          label="Created at"
          numeric
      >
        <template v-slot="{ row }">
          {{ row.createdAt | formatDate }}
        </template>
      </BTableColumn>
      <BTableColumn
          label="Actions"
          numeric
      >
        <template v-slot="{ row }">
          <BSwitch
              :value="row.active"
              size="is-small"
              @input="updatePark(row.id, 'active', $event)"
          />
          <BButton
              size="is-small"
              type="is-primary"
          >
            View
          </BButton>
        </template>
      </BTableColumn>
    </BTable>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {db} from '@/firebase';
import {CollectionType, ParkRequest} from '@/types';

@Component
export default class Admin extends Vue {
  private parkRequests: ParkRequest[] = [];
  private parks: ParkRequest[] = [];

  public created() {
    db
        .collection(CollectionType.ParkRequests)
        .where('submitted', '==', true)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              this.parkRequests.push({...change.doc.data(), id: change.doc.id} as ParkRequest);
            }
            if (change.type === 'modified') {
              // modified
            }
            if (change.type === 'removed') {
              // removed
            }
          });
        });

    db
        .collection(CollectionType.Parks)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              this.parks.push({...change.doc.data(), id: change.doc.id} as ParkRequest);
            }
            if (change.type === 'modified') {
              // modified
            }
            if (change.type === 'removed') {
              // removed
            }
          });
        });
  }

  public async updatePark(id: string, field: string, value: any) {
    try {
      await db.collection(CollectionType.Parks).doc(id).update({[field]: value});
      this.$buefy.toast.open({
        type: 'is-success',
        message: 'Park updated',
      });
    } catch (e) {
      this.$buefy.toast.open({
        type: 'is-danger',
        message: 'Something went wrong.',
      });
    }
  }
}
</script>

<style scoped>

</style>
