<template>
  <div class="container m-auto">
    <validation-observer v-slot="{ handleSubmit }">
      <div class="card m-4">
        <header class="card-header">
          <p class="card-header-title">
            Park editor
          </p>
        </header>
        <div class="card-content">
          <b-carousel v-if="uploadedFiles && uploadedFiles.length">
            <b-carousel-item v-for="upload in uploadedFiles" :key="upload.name">
              <figure class="image">
                <img
                    :src="upload.url"
                    :alt="upload.name"
                >
              </figure>
            </b-carousel-item>
          </b-carousel>
          <div class="mb-4">
            <b-input-with-validator
                v-model="park.name"
                label="Name *"
                rules="required|min:3"
                vid="name"
            />
          </div>
          <div class="mb-4">
            <div class="columns">
              <div class="column">
                <b-field
                    class="mb-4"
                    label="Location *"
                >
                  <div style="border-radius: 4px; overflow: hidden;">
                    <map-component
                        :address.sync="park.address"
                        :geo-location.sync="park.geoLocation"
                        style="width: 100%; min-height: 400px;"
                    />
                  </div>
                </b-field>
                <p v-if="park.address">
                  <strong>Address:</strong> {{ park.address }}
                </p>
              </div>
              <div class="column">
                <b-field label="Photos">
                  <b-upload
                      accept=".jpg,.jpeg,.png"
                      drag-drop
                      expanded
                      multiple
                      native
                      @input="uploadImages"
                  >
                    <section class="section">
                      <div class="content has-text-centered">
                        <p>
                          <b-icon
                              icon="upload"
                              size="is-large"
                          >
                          </b-icon>
                        </p>
                        <p>Drop your files here or click to upload</p>
                      </div>
                    </section>
                  </b-upload>
                </b-field>
                <div class="is-flex is-flex-wrap-wrap">
                  <div
                      v-for="upload in uploads"
                      :key="upload.name"
                      class="card p-2 m-2"
                  >
                    <figure class="image is-64x64">
                      <img
                          v-if="upload.url"
                          :alt="upload.name"
                          :src="upload.url"
                      >
                      <div v-else>
                        <p class="is-size-7 has-text-centered"> {{ upload.name }} </p>
                        <p class="has-text-weight-bold"> {{ upload.progress }}% </p>
                      </div>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <b-field label="Description">
              <b-input
                  maxlength="250"
                  placeholder
                  type="textarea"
              ></b-input>
            </b-field>
          </div>
        </div>
        <footer class="card-footer">
          <div class="card-footer-item">
            <b-button
                expanded
                type="is-primary"
                :loading="loading"
                :disabled="loading"
                @click="handleSubmit(submit)"
            >
              Save
            </b-button>
          </div>
        </footer>
      </div>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Park} from '@/types';
import {db, storage} from '@/firebase';
import BInputWithValidator from '@/components/inputs/BInputWithValidator.vue';
import MapComponent from '@/components/park-editor/MapComponent.vue';
import {ValidationObserver} from 'vee-validate';
import {StateType} from '@/store/types';

type Upload = {
  task: object,
  url: string | null,
  progress: number,
  name: string,
}

@Component({
  components: {MapComponent, BInputWithValidator, ValidationObserver},
})
export default class ParkEditor extends Vue {
  @Prop(String) public readonly id: string | undefined;

  private park: Park = {
    name: '',
    geoLocation: {
      lat: '',
      lng: '',
    },
    address: '',
    active: false,
    photos: [],
    contributors: [],
  };
  private uploads: Upload[] = [];
  private originalPark: Park | null = null;
  private loading: boolean = false;

  get uploadedFiles() {
    return [...this.park.photos, ...this.uploads.filter((upload) => upload.url)];
  }

  public created() {
    this.loadPark();
  }

  public async loadPark() {
    if (!this.id) {
      try {
        this.park.contributors.push(this.$store.state[StateType.USER].id);
        const doc = await db.collection('parks-pending').add(this.park);
        await this.$router.push({name: 'park-editor', params: {id: doc.id}});
      } catch {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Something went wrong. Please try again!',
        });
      }
    } else {
      const doc = await db.collection('parks-pending').doc(this.id).get();
      if (doc.exists) {
        const park = doc.data() as Park;
        this.park = park;
        this.originalPark = JSON.parse(JSON.stringify(park));
      }
    }
  }

  public async uploadImages(files: FileList) {
    if (!this.id) {
      return;
    }
    for (const file of files) {
      const task = storage.child(`images/${this.id}/${file.name}`).put(file);
      const upload: Upload = {
        task,
        url: null,
        progress: 0,
        name: file.name,
      };
      this.uploads.push(upload);
      task.on('state-changed', (snapshot) => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, (error) => {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Upload failed. Please try again',
        });
        console.error(error);
        this.uploads.splice(this.uploads.indexOf(upload), 1);
      }, () => {
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          upload.url = downloadURL;
        });
      });
    }
  }

  public async submit() {
    this.loading = true;
    const park = this.park as Park;
    park.photos = this.uploads.map(e => e.url || '');
    if (park.geoLocation && park.name) {
      try {
        await db.collection('parks-pending').doc(this.id).set(this.park);
      } catch (e) {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Something went wrong. Please try again!',
        });
        console.error(e);
      }
    }
    this.loading = false;
  }
}
</script>

<style scoped>

</style>
