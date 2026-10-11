/**
 * TMNT Site Content & Supabase API Client
 * Manages database settings, storage uploads, and local caching
 */

const TMNT_CONFIG = {
  supabaseUrl: 'https://eqtruojlyrijocszgmye.supabase.co',
  supabaseKey: 'sb_publishable_j3ulZm5oneUcBWBDskw3kQ_xbAKgpbG',
  bucketName: 'tmnt',
  storageKey: 'tmnt_site_content_v1'
};

// Default fallback assets
const DEFAULT_CONTENT = {
  hero: {
    title: 'تحميل لعبة سلاحف النينجا: ميوتانت ميلي للكمبيوتر',
    summary: 'الإصدار الأصلي الكامل TMNT: Mutant Melee (2005) برابط مباشر وسريع من سيرفر التخزين السحابي. نسخة محمولة مجهزة مسبقاً وتعمل مباشرة على جميع أنظمة ويندوز بدون تثبيت معقد.',
    image: 'tmnt_title_screen.png',
    gameZipUrl: 'https://download1500.mediafire.com/kyzc2ri5uhxg6VbgbsnrrMowcsdyWyA2Op20F7DCuQ2wmK3H-mbLHfDneQuPPto9RI_rIT1KXfp5HTOBYfc-tcX_EivOzqzUGDdOtc7Z1MRkBnt4KUW02e4f9KUzUj1QS2DQ_l88Y56aO16mFnBfQ4HGQN_RUci-MYtbPEdT0fP7/4v9zq22krgx07l7/%D9%86%D9%8A%D9%86%D8%AC%D8%A7+%D8%AA%D9%8A%D8%AF%D9%88%D8%B2.zip',
    gameZipName: 'نينجا تيدوز.zip',
    gameZipSize: '146.4 MB'
  },
  screenshots: [
    { id: 'screen_1', title: 'شاشة البداية وشعار اللعبة TMNT Mutant Melee', image: 'tmnt_title_screen.png' },
    { id: 'screen_2', title: 'قتال وتدريب حلبة الدوجو ضد الزعيم Hun', image: 'tmnt_gameplay_dojo.png' },
    { id: 'screen_3', title: 'شاشة اختيار الشخصيات ونقاط التوكنز في اللعبة', image: 'tmnt_character_select.png' },
    { id: 'screen_4', title: 'القائمة الرئيسية: طور القصة والمعارك الجماعية', image: 'tmnt_main_menu.png' }
  ],
  characters: [
    { id: 'char_leo', name: 'ليوناردو (Leonardo)', weapon: '⚔️ سيفان كاتانا', desc: 'القائد الحكيم المتوازن في السرعة والقوة القتالية، يمتلك ضربات متتالية دقيقة تحسم المعارك.', image: 'game_art_leo.png' },
    { id: 'char_raph', name: 'رافائيل (Raphael)', weapon: '🗡️ خنجران ساي', desc: 'المقاتل الشرس صاحب اللكمات الفتاكة والالتحامات القريبة وقوة الضرر العالية في حلبات القتال.', image: 'avatar_raph.png' },
    { id: 'char_donnie', name: 'دوناتيلو (Donatello)', weapon: '🥢 عصا البو', desc: 'العبقري التكنولوجي، يتميز بمدى ضربات واسع يصد الأعداء من مسافات آمنة ويصيب عدة خصوم معاً.', image: 'avatar_donnie.png' },
    { id: 'char_mikey', name: 'مايكل أنجلو (Michelangelo)', weapon: '🌀 نانشاكو النينجا', desc: 'الأسرع حركة ورشاقة في اللعبة، أسلوب قتال استعراضي خفيف يربك الخصوم ويمنعهم من الرد.', image: 'avatar_mikey.png' },
    { id: 'char_splinter', name: 'المعلم سبلينتر (Splinter)', weapon: '🥋 فنون النينجتسو', desc: 'معلم النينجتسو وسرعة البديهة.', image: 'avatar_splinter.png' },
    { id: 'char_april', name: 'إبريل أونيل (April O\'Neil)', weapon: '⚡ السرعة والمراوغة', desc: 'الحليفة الوفية والمراوغة السريعة.', image: 'avatar_april.png' },
    { id: 'char_hun', name: 'هان (Hun)', weapon: '💥 اللكمات الثقيلة', desc: 'زعيم العصابة واللكمات الثقيلة.', image: 'avatar_hun.png' }
  ],
  controls: {
    icon: 'tmntconfig_icon.png',
    settingsImage: 'tmnt_control_settings.png'
  }
};

class TmntAPI {
  static getLocalData() {
    try {
      const saved = localStorage.getItem(TMNT_CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If zip url is the unverified remote supabase link, fallback to local zip
        if (parsed.hero && parsed.hero.gameZipUrl && parsed.hero.gameZipUrl.indexOf('eqtruojlyrijocszgmye.supabase.co') !== -1) {
          parsed.hero.gameZipUrl = 'https://download1500.mediafire.com/kyzc2ri5uhxg6VbgbsnrrMowcsdyWyA2Op20F7DCuQ2wmK3H-mbLHfDneQuPPto9RI_rIT1KXfp5HTOBYfc-tcX_EivOzqzUGDdOtc7Z1MRkBnt4KUW02e4f9KUzUj1QS2DQ_l88Y56aO16mFnBfQ4HGQN_RUci-MYtbPEdT0fP7/4v9zq22krgx07l7/%D9%86%D9%8A%D9%86%D8%AC%D8%A7+%D8%AA%D9%8A%D8%AF%D9%88%D8%B2.zip';
        }
        return Object.assign({}, DEFAULT_CONTENT, parsed);
      }
    } catch (e) {
      console.warn('LocalStorage access error', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  }

  static saveLocalData(data) {
    try {
      localStorage.setItem(TMNT_CONFIG.storageKey, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      return false;
    }
  }

  static async fetchRemoteData() {
    // Try fetching from Supabase database table `site_settings`
    try {
      const res = await fetch(`${TMNT_CONFIG.supabaseUrl}/rest/v1/site_settings?id=eq.tmnt_config&select=*`, {
        headers: {
          apikey: TMNT_CONFIG.supabaseKey,
          Authorization: `Bearer ${TMNT_CONFIG.supabaseKey}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0 && rows[0].content) {
          const merged = Object.assign({}, DEFAULT_CONTENT, rows[0].content);
          this.saveLocalData(merged);
          return merged;
        }
      }
    } catch (err) {
      console.log('Supabase DB fallback to local data', err);
    }
    return this.getLocalData();
  }

  static async saveRemoteData(data) {
    this.saveLocalData(data);
    try {
      await fetch(`${TMNT_CONFIG.supabaseUrl}/rest/v1/site_settings`, {
        method: 'POST',
        headers: {
          apikey: TMNT_CONFIG.supabaseKey,
          Authorization: `Bearer ${TMNT_CONFIG.supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: 'tmnt_config',
          content: data,
          updated_at: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn('Remote sync error, local saved', err);
    }
    return true;
  }

  static uploadFile(file, fileName, onProgress) {
    return new Promise((resolve, reject) => {
      const url = `${TMNT_CONFIG.supabaseUrl}/storage/v1/object/${TMNT_CONFIG.bucketName}/${encodeURIComponent(fileName)}`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('apikey', TMNT_CONFIG.supabaseKey);
      xhr.setRequestHeader('Authorization', `Bearer ${TMNT_CONFIG.supabaseKey}`);
      xhr.setRequestHeader('x-upsert', 'true');
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent, e.loaded, e.total);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const publicUrl = `${TMNT_CONFIG.supabaseUrl}/storage/v1/object/public/${TMNT_CONFIG.bucketName}/${encodeURIComponent(fileName)}`;
          resolve({ success: true, publicUrl });
        } else {
          // Fallback to local Data URL
          const reader = new FileReader();
          reader.onload = () => {
            resolve({ success: true, publicUrl: reader.result, isLocal: true });
          };
          reader.readAsDataURL(file);
        }
      };

      xhr.onerror = () => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ success: true, publicUrl: reader.result, isLocal: true });
        };
        reader.readAsDataURL(file);
      };

      xhr.send(file);
    });
  }
}

if (typeof window !== 'undefined') {
  window.TmntAPI = TmntAPI;
  window.DEFAULT_CONTENT = DEFAULT_CONTENT;
}
