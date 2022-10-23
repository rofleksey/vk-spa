<template>
  <div class="loading">
    <div class="spinner">
      <div class="mask">
        <div class="maskedCircle" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation keyframes - you need to add prefixes */
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes spin {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(360deg);
  }
}

@-ms-keyframes spin {
  from {
    -ms-transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
  }
}

.loading {
  position: relative;
  width: 28px;
  height: 28px;
}

.loading .spinner {
  position: absolute;
  left: 1px;
  top: 1px;
  width: 26px;
  height: 26px;
  -webkit-animation: spin 1s infinite linear;
  -moz-animation: spin 1s infinite linear;
  -o-animation: spin 1s infinite linear;
  animation: spin 1s infinite linear;
}

.loading .mask {
  width: 12px;
  height: 12px;
  overflow: hidden;
}

.loading .maskedCircle {
  width: 20px;
  height: 20px;
  border-radius: 12px;
  border: 3px solid #ffffff;
}
</style>
