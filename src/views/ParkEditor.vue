<template>
  <div class="container m-auto p-4">
    <ParkForm
        v-if="editing"
        v-model="parkRequest.park"
        editing
        :loading="loading"
        :uploads="uploads"
        @save="save"
        @submit="submit"
        @upload-images="uploadImages"
        @delete-upload="deleteUpload"
        @delete="startDeleteParkRequest"
    />
    <ParkCardDetailed
        v-else
        :park="parkRequest.park"
    >
      <template #actions>
        <BButton
            icon-left="edit"
            outlined
            type="is-primary"
            @click="editing = true"
        >Edit
        </BButton>
      </template>
    </ParkCardDetailed>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {CollectionType, Park, ParkPhoto, ParkPhotoUpload, ParkRequest, PathNames} from '@/types';
import {db, storage} from '@/firebase';
import BInputWithValidator from '@/components/inputs/BInputWithValidator.vue';
import MapComponent from '@/components/park-editor/MapComponent.vue';
import {ValidationObserver} from 'vee-validate';
import {StateType} from '@/store/types';
import ParkForm from '@/components/park/ParkForm.vue';
import ParkCard from '@/components/park/ParkCard.vue';
import ParkCardDetailed from '@/components/park/ParkCardDetailed.vue';

@Component({
  components: {ParkCardDetailed, ParkCard, ParkForm, MapComponent, BInputWithValidator, ValidationObserver},
})
export default class ParkEditor extends Vue {
  @Prop(String) private readonly id: string | undefined;

  private parkRequest: ParkRequest = {
    park: {
      name: '',
      geoLocation: {
        lat: '',
        lng: '',
      },
      address: '',
      active: false,
      photos: [],
      contributors: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    },
    submitted: false,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };
  private uploads: ParkPhotoUpload[] = [];
  private originalPark: Park | null = null;
  private loading: boolean = false;
  private editing: boolean = false;

  public created() {
    this.loadPark();
  }

  public async loadPark() {
    if (!this.id) {
      this.editing = true;
      try {
        this.parkRequest.park.contributors.push(this.$store.state[StateType.USER].id);
        const doc = await db.collection(CollectionType.ParkRequests).add(this.parkRequest);
        await this.$router.push({name: PathNames.ParkEditor, params: {id: doc.id}});
      } catch {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Something went wrong. Please try again!',
        });
      }
    } else {
      const doc = await db.collection(CollectionType.ParkRequests).doc(this.id).get();
      if (doc.exists) {
        const parkRequest = doc.data() as ParkRequest;
        this.parkRequest = parkRequest;
        this.originalPark = JSON.parse(JSON.stringify(parkRequest));
      }
    }
  }

  public async uploadImages(files: FileList) {
    if (!this.id) {
      return;
    }
    for (const file of files) {
      const task = storage.child(`images/${this.id}/${file.name}`).put(file);
      const upload: ParkPhotoUpload = {
        task,
        url: '',
        progress: 0,
        name: file.name,
      };
      this.uploads.push(upload);
      task.on('state-changed', (snapshot) => {
        upload.progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
          this.uploads.splice(this.uploads.indexOf(upload), 1);
          this.parkRequest.park.photos.push({url: upload.url, name: upload.name});
        });
      });
    }
  }

  public async deleteUpload(upload: ParkPhotoUpload | ParkPhoto) {
    try {
      await storage.child(`images/${this.id}/${upload.name}`).delete();
      if (this.uploads.includes(upload as ParkPhotoUpload)) {
        this.uploads.splice(this.uploads.indexOf(upload as ParkPhotoUpload), 1);
      } else if (this.parkRequest.park.photos.includes(upload as ParkPhoto)) {
        this.parkRequest.park.photos.splice(this.parkRequest.park.photos.indexOf(upload as ParkPhoto), 1);
      }
    } catch (e) {
      this.$buefy.toast.open({
        type: 'is-danger',
        message: 'Something went wrong. Please try again.',
      });
      console.error(e);
    }
  }

  public async startDeleteParkRequest() {
    this.$buefy.dialog.confirm({
      type: 'is-danger',
      message: 'Are you sure you want to <strong>delete</strong> this park request?',
      onConfirm: () => this.deleteParkRequest(),
      confirmText: 'Delete'
    })
  }

  public async deleteParkRequest() {
    try {
      await db.collection(CollectionType.ParkRequests).doc(this.id).delete()
      this.parkRequest.park.photos.forEach(this.deleteUpload);
      await this.$router.push({ name: PathNames.MyParks })
    } catch (e) {
      this.$buefy.toast.open({
        type: 'is-danger',
        message: 'Something went wrong. Please try again.',
      });
      console.error(e);
    }
  }

  public async submit() {
    try {
      this.parkRequest.submitted = true;
      await db.collection(CollectionType.ParkRequests).doc(this.id).set(this.parkRequest);
      await this.$router.push({ name: PathNames.MyParks });
      this.$buefy.toast.open({
        type: 'is-success',
        message: 'Park submitted for review!',
      });
    } catch (e) {
      this.$buefy.toast.open({
        type: 'is-danger',
        message: 'Something went wrong. Please try again!',
      });
      console.error(e);
    }
  }

  public async save(redirect: boolean) {
    this.loading = true;
    if (this.parkRequest.park.geoLocation && this.parkRequest.park.name) {
      try {
        await db.collection(CollectionType.ParkRequests).doc(this.id).set(this.parkRequest);
        this.$buefy.toast.open({
          type: 'is-success',
          message: 'Changes saved!',
        });
        if (redirect) {
          await this.$router.push({ name: PathNames.MyParks })
        }
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

